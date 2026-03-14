import crypto from 'node:crypto';

import { factories } from '@strapi/strapi';

type AnyRecord = Record<string, unknown>;
type StringMap = Record<string, string>;
type SignatureAlgorithm = 'md5' | 'sha256' | 'sha512';
type ReceiptItem = {
  name: string;
  quantity: number;
  sum: number;
  tax: string;
  payment_method: string;
  payment_object: string;
};
type ReceiptPayload = {
  sno?: string;
  items: ReceiptItem[];
};

type RobokassaConfig = {
  merchantLogin: string;
  password1: string;
  password2: string;
  paymentUrl: string;
  successUrl?: string;
  failUrl?: string;
  resultUrl?: string;
  frontendSuccessUrl?: string;
  frontendFailUrl?: string;
  isTest: boolean;
  hashAlgorithm: SignatureAlgorithm;
  receiptDefaultTax: string;
  receiptDefaultPaymentMethod: string;
  receiptDefaultPaymentObject: string;
  receiptSno?: string;
};

const PAYMENT_UID = 'api::payment.payment' as any;
const HASH_ALGORITHMS: SignatureAlgorithm[] = ['md5', 'sha256', 'sha512'];
const RECEIPT_TAX_VALUES = new Set(['none', 'vat0', 'vat10', 'vat20', 'vat110', 'vat120']);
const RECEIPT_PAYMENT_METHOD_VALUES = new Set([
  'full_payment',
  'full_prepayment',
  'prepayment',
  'advance',
  'partial_payment',
  'credit',
  'credit_payment',
]);
const RECEIPT_PAYMENT_OBJECT_VALUES = new Set([
  'commodity',
  'excise',
  'job',
  'service',
  'gambling_bet',
  'gambling_prize',
  'lottery',
  'lottery_prize',
  'intellectual_activity',
  'payment',
  'agent_commission',
  'composite',
  'another',
]);
const RECEIPT_SNO_VALUES = new Set([
  'osn',
  'usn_income',
  'usn_income_outcome',
  'esn',
  'patent',
]);

const parseBoolean = (value?: string) => {
  if (!value) return false;
  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
};

const getRequiredEnv = (name: string) => {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
};

const getConfig = (): RobokassaConfig => {
  const hashAlgorithmRaw = process.env.ROBOKASSA_HASH_ALGORITHM?.trim().toLowerCase() || 'md5';
  if (!HASH_ALGORITHMS.includes(hashAlgorithmRaw as SignatureAlgorithm)) {
    throw new Error(`Unsupported ROBOKASSA_HASH_ALGORITHM: ${hashAlgorithmRaw}`);
  }

  return {
    merchantLogin: getRequiredEnv('ROBOKASSA_MERCHANT_LOGIN'),
    password1: getRequiredEnv('ROBOKASSA_PASSWORD1'),
    password2: getRequiredEnv('ROBOKASSA_PASSWORD2'),
    paymentUrl: process.env.ROBOKASSA_PAYMENT_URL?.trim() || 'https://auth.robokassa.ru/Merchant/Index.aspx',
    successUrl: process.env.ROBOKASSA_SUCCESS_URL?.trim(),
    failUrl: process.env.ROBOKASSA_FAIL_URL?.trim(),
    resultUrl: process.env.ROBOKASSA_RESULT_URL?.trim(),
    frontendSuccessUrl: process.env.ROBOKASSA_FRONTEND_SUCCESS_URL?.trim(),
    frontendFailUrl: process.env.ROBOKASSA_FRONTEND_FAIL_URL?.trim(),
    isTest: parseBoolean(process.env.ROBOKASSA_IS_TEST),
    hashAlgorithm: hashAlgorithmRaw as SignatureAlgorithm,
    receiptDefaultTax: process.env.ROBOKASSA_RECEIPT_TAX?.trim().toLowerCase() || 'none',
    receiptDefaultPaymentMethod:
      process.env.ROBOKASSA_RECEIPT_PAYMENT_METHOD?.trim().toLowerCase() || 'full_prepayment',
    receiptDefaultPaymentObject:
      process.env.ROBOKASSA_RECEIPT_PAYMENT_OBJECT?.trim().toLowerCase() || 'commodity',
    receiptSno: process.env.ROBOKASSA_RECEIPT_SNO?.trim().toLowerCase() || undefined,
  };
};

const sanitizePrimitiveMap = (input: unknown): StringMap => {
  if (!input || typeof input !== 'object') return {};

  return Object.entries(input as AnyRecord).reduce<StringMap>((acc, [key, value]) => {
    if (value === null || typeof value === 'undefined') return acc;
    if (Array.isArray(value)) {
      if (value.length > 0 && value[0] !== null && typeof value[0] !== 'undefined') {
        acc[key] = String(value[0]).trim();
      }
      return acc;
    }
    if (typeof value === 'object') return acc;
    acc[key] = String(value).trim();
    return acc;
  }, {});
};

const normalizeAmount = (amount: unknown): string => {
  const value = typeof amount === 'number' ? amount : Number(String(amount).replace(',', '.'));
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error('Amount must be a positive number');
  }
  return value.toFixed(2);
};

const normalizeMoneyNumber = (value: unknown, fieldName: string): number => {
  const numeric = typeof value === 'number' ? value : Number(String(value).replace(',', '.'));
  if (!Number.isFinite(numeric) || numeric <= 0) {
    throw new Error(`${fieldName} must be a positive number`);
  }
  return Number(numeric.toFixed(2));
};

const normalizeReceiptItemName = (value: unknown) => {
  const raw = String(value ?? '').trim().replace(/\s+/g, ' ');
  if (!raw) {
    throw new Error('Receipt item name is required');
  }
  return raw.slice(0, 128);
};

const normalizeInvId = (invId: unknown) => {
  if (typeof invId === 'undefined' || invId === null || String(invId).trim() === '') {
    const randomSuffix = crypto.randomInt(100, 1000);
    return `${Date.now()}${randomSuffix}`;
  }
  const normalized = String(invId).trim();
  if (!/^\d+$/.test(normalized)) {
    throw new Error('InvId must contain only digits');
  }
  return normalized;
};

const normalizeShpEntries = (input: unknown): Array<[string, string]> => {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return [];

  return Object.entries(input as AnyRecord)
    .filter(([, value]) => value !== null && typeof value !== 'undefined')
    .map(([key, value]) => {
      const normalizedKey = key.startsWith('Shp_') ? key : `Shp_${key}`;
      return [normalizedKey, String(value)] as [string, string];
    })
    .sort(([a], [b]) => a.localeCompare(b));
};

const extractShpFromPayload = (payload: StringMap): Array<[string, string]> => {
  return Object.entries(payload)
    .filter(([key, value]) => key.startsWith('Shp_') && value !== '')
    .sort(([a], [b]) => a.localeCompare(b));
};

const makeSignature = (algorithm: SignatureAlgorithm, raw: string) => {
  return crypto.createHash(algorithm).update(raw).digest('hex').toLowerCase();
};

const signaturesEqual = (left: string, right: string) => {
  const l = left.trim().toLowerCase();
  const r = right.trim().toLowerCase();
  if (l.length !== r.length) return false;
  return crypto.timingSafeEqual(Buffer.from(l), Buffer.from(r));
};

const buildSignatureBase = (parts: string[], shpEntries: Array<[string, string]>) => {
  const values = [...parts, ...shpEntries.map(([key, value]) => `${key}=${value}`)];
  return values.join(':');
};

const appendRedirectQuery = (targetUrl: string, payload: StringMap, status: 'success' | 'fail') => {
  const url = new URL(targetUrl);
  const invId = payload.InvId || '';
  const outSum = payload.OutSum || '';
  const orderId = payload.Shp_orderId || '';

  url.searchParams.set('status', status);
  if (invId) url.searchParams.set('invId', invId);
  if (outSum) url.searchParams.set('outSum', outSum);
  if (orderId) url.searchParams.set('orderId', orderId);

  return url.toString();
};

const getFirstValue = (payload: StringMap, keys: string[]) => {
  for (const key of keys) {
    const value = payload[key];
    if (value) return value;
  }
  return '';
};

const normalizeReceipt = (value: unknown, config: RobokassaConfig): ReceiptPayload | null => {
  if (value === null || typeof value === 'undefined' || value === '') return null;

  const source =
    typeof value === 'string' ? (JSON.parse(value) as AnyRecord) : (value as AnyRecord);
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    throw new Error('Receipt must be an object');
  }

  const sourceItems = Array.isArray(source.items) ? source.items : null;
  if (!sourceItems || sourceItems.length === 0) {
    throw new Error('Receipt.items must be a non-empty array');
  }
  if (sourceItems.length > 100) {
    throw new Error('Receipt.items cannot contain more than 100 items');
  }

  const normalizedItems = sourceItems.map((item, index) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new Error(`Receipt item #${index + 1} must be an object`);
    }

    const data = item as AnyRecord;
    const name = normalizeReceiptItemName(data.name);
    const quantity = normalizeMoneyNumber(data.quantity, `Receipt item #${index + 1} quantity`);
    const sum =
      typeof data.sum !== 'undefined'
        ? normalizeMoneyNumber(data.sum, `Receipt item #${index + 1} sum`)
        : normalizeMoneyNumber(
            Number(data.price ?? 0) * quantity,
            `Receipt item #${index + 1} sum`
          );

    const tax = String(data.tax ?? config.receiptDefaultTax)
      .trim()
      .toLowerCase();
    if (!RECEIPT_TAX_VALUES.has(tax)) {
      throw new Error(`Unsupported Receipt tax value: ${tax}`);
    }

    const paymentMethod = String(data.payment_method ?? config.receiptDefaultPaymentMethod)
      .trim()
      .toLowerCase();
    if (!RECEIPT_PAYMENT_METHOD_VALUES.has(paymentMethod)) {
      throw new Error(`Unsupported Receipt payment_method value: ${paymentMethod}`);
    }

    const paymentObject = String(data.payment_object ?? config.receiptDefaultPaymentObject)
      .trim()
      .toLowerCase();
    if (!RECEIPT_PAYMENT_OBJECT_VALUES.has(paymentObject)) {
      throw new Error(`Unsupported Receipt payment_object value: ${paymentObject}`);
    }

    return {
      name,
      quantity,
      sum,
      tax,
      payment_method: paymentMethod,
      payment_object: paymentObject,
    };
  });

  const receipt: ReceiptPayload = { items: normalizedItems };
  const sourceSno = String(source.sno ?? config.receiptSno ?? '')
    .trim()
    .toLowerCase();
  if (sourceSno) {
    if (!RECEIPT_SNO_VALUES.has(sourceSno)) {
      throw new Error(`Unsupported Receipt sno value: ${sourceSno}`);
    }
    receipt.sno = sourceSno;
  }

  return receipt;
};

export default factories.createCoreService(PAYMENT_UID, ({ strapi }) => ({
  getConfig,

  async initPayment(input: AnyRecord) {
    const documents = strapi.documents(PAYMENT_UID) as any;
    const config = getConfig();
    const payload = sanitizePrimitiveMap(input);
    const invId = normalizeInvId(payload.invId);
    const orderId = payload.orderId?.trim();

    if (!orderId) {
      throw new Error('orderId is required');
    }

    const outSum = normalizeAmount(payload.amount);
    const receipt = normalizeReceipt(input.receipt, config);
    const receiptJson = receipt ? JSON.stringify(receipt) : '';
    const receiptForSignature = receiptJson ? encodeURIComponent(receiptJson) : '';
    if (receipt) {
      const receiptTotal = Number(
        receipt.items.reduce((acc, item) => acc + item.sum, 0).toFixed(2)
      );
      if (receiptTotal.toFixed(2) !== outSum) {
        throw new Error('Receipt items sum must be equal to amount');
      }
    }

    const shpEntries = normalizeShpEntries(input.shp);
    const signatureParts = [config.merchantLogin, outSum, invId];
    if (receiptForSignature) signatureParts.push(receiptForSignature);
    signatureParts.push(config.password1);
    const signatureBase = buildSignatureBase(
      signatureParts,
      shpEntries
    );
    const signatureValue = makeSignature(config.hashAlgorithm, signatureBase);
    const isTest = typeof payload.isTest === 'string' ? parseBoolean(payload.isTest) : config.isTest;

    const existing = await documents.findMany({
      filters: { invId: { $eq: invId } },
      limit: 1,
    });
    if (existing.length > 0) {
      throw new Error(`Payment with InvId=${invId} already exists`);
    }

    await documents.create({
      data: {
        invId,
        orderId,
        amount: outSum,
        currency: payload.currency || 'RUB',
        description: payload.description || null,
        email: payload.email || null,
        status: 'pending',
        isTest,
        metadata: input.metadata && typeof input.metadata === 'object' ? input.metadata : null,
        shp: Object.fromEntries(shpEntries),
        rawInitPayload: payload,
      },
    });

    const params = new URLSearchParams({
      MerchantLogin: config.merchantLogin,
      OutSum: outSum,
      InvId: invId,
      SignatureValue: signatureValue,
    });
    if (payload.description) params.set('Description', payload.description);
    if (payload.email) params.set('Email', payload.email);
    if (receiptJson) params.set('Receipt', receiptJson);
    if (config.successUrl) params.set('SuccessURL', config.successUrl);
    if (config.failUrl) params.set('FailURL', config.failUrl);
    if (config.resultUrl) params.set('ResultURL', config.resultUrl);
    if (isTest) params.set('IsTest', '1');
    for (const [key, value] of shpEntries) params.set(key, value);

    return {
      invId,
      orderId,
      outSum,
      paymentUrl: `${config.paymentUrl}?${params.toString()}`,
      signatureValue,
      isTest,
      receiptIncluded: Boolean(receiptJson),
    };
  },

  async processResultCallback(rawPayload: AnyRecord) {
    const documents = strapi.documents(PAYMENT_UID) as any;
    const config = getConfig();
    const payload = sanitizePrimitiveMap(rawPayload);
    const outSum = getFirstValue(payload, ['OutSum', 'outSum', 'outsum']);
    const invId = getFirstValue(payload, ['InvId', 'InvID', 'invId', 'invid']);
    const receivedSignature = getFirstValue(payload, ['SignatureValue', 'signatureValue', 'Signature']);

    if (!outSum || !invId || !receivedSignature) {
      throw new Error('Missing required callback params: OutSum, InvId, SignatureValue');
    }

    const shpEntries = extractShpFromPayload(payload);
    const expectedSignature = makeSignature(
      config.hashAlgorithm,
      buildSignatureBase([outSum, invId, config.password2], shpEntries)
    );
    const signatureValid = signaturesEqual(receivedSignature, expectedSignature);

    if (!signatureValid) {
      return { invId, outSum, signatureValid };
    }

    const matches = await documents.findMany({
      filters: { invId: { $eq: invId } },
      limit: 1,
    });

    const current = matches[0] as AnyRecord | undefined;
    if (!current) {
      const fallbackOrderId = payload.Shp_orderId || `robokassa-${invId}`;
      await documents.create({
        data: {
          invId,
          orderId: fallbackOrderId,
          amount: normalizeAmount(outSum),
          currency: payload.IncCurrLabel || 'RUB',
          status: 'paid',
          isTest: parseBoolean(payload.IsTest),
          paidAt: new Date().toISOString(),
          resultSignatureValid: true,
          shp: Object.fromEntries(shpEntries),
          rawResultPayload: payload,
        },
      });

      return { invId, outSum, signatureValid, alreadyPaid: false };
    }

    const alreadyPaid = current.status === 'paid';
    if (!alreadyPaid) {
      await documents.update({
        documentId: current.documentId,
        data: {
          amount: normalizeAmount(outSum),
          currency: payload.IncCurrLabel || current.currency || 'RUB',
          status: 'paid',
          paidAt: new Date().toISOString(),
          resultSignatureValid: true,
          rawResultPayload: payload,
          shp: Object.fromEntries(shpEntries),
        },
      });
    }

    return { invId, outSum, signatureValid, alreadyPaid };
  },

  verifyUserRedirect(rawPayload: AnyRecord, type: 'success' | 'fail') {
    const config = getConfig();
    const payload = sanitizePrimitiveMap(rawPayload);
    const outSum = getFirstValue(payload, ['OutSum', 'outSum', 'outsum']);
    const invId = getFirstValue(payload, ['InvId', 'InvID', 'invId', 'invid']);
    const receivedSignature = getFirstValue(payload, ['SignatureValue', 'signatureValue', 'Signature']);
    const shpEntries = extractShpFromPayload(payload);

    let signatureValid: boolean | null = null;
    if (outSum && invId && receivedSignature) {
      const expectedSignature = makeSignature(
        config.hashAlgorithm,
        buildSignatureBase([outSum, invId, config.password1], shpEntries)
      );
      signatureValid = signaturesEqual(receivedSignature, expectedSignature);
    }

    const redirectBase = type === 'success' ? config.frontendSuccessUrl : config.frontendFailUrl;
    const redirectUrl = redirectBase ? appendRedirectQuery(redirectBase, payload, type) : null;

    return {
      type,
      invId,
      outSum,
      signatureValid,
      redirectUrl,
      payload,
    };
  },

  async markFailed(invId: string, rawPayload: AnyRecord) {
    const documents = strapi.documents(PAYMENT_UID) as any;
    if (!invId) return;

    const matches = await documents.findMany({
      filters: { invId: { $eq: invId } },
      limit: 1,
    });
    const current = matches[0] as AnyRecord | undefined;
    if (!current || current.status === 'paid' || current.status === 'failed') return;

    await documents.update({
      documentId: current.documentId,
      data: {
        status: 'failed',
        rawFailPayload: sanitizePrimitiveMap(rawPayload),
      },
    });
  },
})) as any;
