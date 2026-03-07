import { factories } from '@strapi/strapi';

type AnyRecord = Record<string, unknown>;
const PAYMENT_UID = 'api::payment.payment' as any;

const mergePayload = (query: unknown, body: unknown): AnyRecord => {
  const queryMap = query && typeof query === 'object' ? (query as AnyRecord) : {};
  const bodyMap = body && typeof body === 'object' ? (body as AnyRecord) : {};
  return { ...queryMap, ...bodyMap };
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return 'Unexpected error';
};

export default factories.createCoreController(PAYMENT_UID, ({ strapi }) => ({
  async init(ctx) {
    try {
      const paymentService = strapi.service('api::payment.payment') as {
        initPayment: (input: AnyRecord) => Promise<unknown>;
      };
      const data = await paymentService.initPayment((ctx.request?.body ?? {}) as AnyRecord);
      return ctx.send({ ok: true, data });
    } catch (error) {
      strapi.log.error(`[robokassa:init] ${getErrorMessage(error)}`);
      return ctx.send({ ok: false, error: getErrorMessage(error) }, 400);
    }
  },

  async result(ctx) {
    try {
      const paymentService = strapi.service('api::payment.payment') as {
        processResultCallback: (payload: AnyRecord) => Promise<{ invId: string; signatureValid: boolean }>;
      };
      const payload = mergePayload(ctx.query, ctx.request?.body);
      const result = await paymentService.processResultCallback(payload);

      if (!result.signatureValid) {
        ctx.status = 400;
        ctx.type = 'text/plain';
        ctx.body = 'bad sign';
        return;
      }

      ctx.status = 200;
      ctx.type = 'text/plain';
      ctx.body = `OK${result.invId}`;
    } catch (error) {
      strapi.log.error(`[robokassa:result] ${getErrorMessage(error)}`);
      ctx.status = 400;
      ctx.type = 'text/plain';
      ctx.body = 'bad sign';
    }
  },

  async success(ctx) {
    try {
      const paymentService = strapi.service('api::payment.payment') as {
        verifyUserRedirect: (
          payload: AnyRecord,
          type: 'success' | 'fail'
        ) => { redirectUrl: string | null };
      };
      const payload = mergePayload(ctx.query, ctx.request?.body);
      const result = paymentService.verifyUserRedirect(payload, 'success');

      if (result.redirectUrl) {
        return ctx.redirect(result.redirectUrl);
      }

      return ctx.send({ ok: true, data: result });
    } catch (error) {
      strapi.log.error(`[robokassa:success] ${getErrorMessage(error)}`);
      return ctx.send({ ok: false, error: getErrorMessage(error) }, 400);
    }
  },

  async fail(ctx) {
    try {
      const paymentService = strapi.service('api::payment.payment') as {
        verifyUserRedirect: (
          payload: AnyRecord,
          type: 'success' | 'fail'
        ) => { invId: string; signatureValid: boolean | null; redirectUrl: string | null };
        markFailed: (invId: string, payload: AnyRecord) => Promise<void>;
      };
      const payload = mergePayload(ctx.query, ctx.request?.body);
      const result = paymentService.verifyUserRedirect(payload, 'fail');

      if (result.signatureValid === true && result.invId) {
        await paymentService.markFailed(result.invId, payload);
      }

      if (result.redirectUrl) {
        return ctx.redirect(result.redirectUrl);
      }

      return ctx.send({ ok: true, data: result });
    } catch (error) {
      strapi.log.error(`[robokassa:fail] ${getErrorMessage(error)}`);
      return ctx.send({ ok: false, error: getErrorMessage(error) }, 400);
    }
  },
})) as any;
