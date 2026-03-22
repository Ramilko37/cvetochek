import type { Core } from '@strapi/strapi';

type AnyRecord = Record<string, unknown>;

const PRODUCT_UID = 'api::product.product' as any;
const CATEGORY_UID = 'api::category.category' as any;
const BANNER_UID = 'api::banner.banner' as any;
const PAGE_UID = 'api::page.page' as any;
const SETTINGS_UID = 'api::site-settings.site-settings' as any;

const parseNumber = (value: unknown) => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string' && value.trim() === '') return null;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
};

const getPublicBaseUrl = () =>
  process.env.STRAPI_PUBLIC_URL?.trim() ||
  process.env.PUBLIC_BASE_URL?.trim() ||
  '';

const toAbsoluteUrl = (raw: unknown) => {
  if (!raw || typeof raw !== 'string') return null;
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
  const base = getPublicBaseUrl();
  return base ? `${base}${raw}` : raw;
};

const normalizeMediaList = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as AnyRecord;
      return toAbsoluteUrl(record.url);
    })
    .filter((v): v is string => Boolean(v));
};

const normalizeMediaSingle = (value: unknown): string | null => {
  if (!value || typeof value !== 'object') return null;
  return toAbsoluteUrl((value as AnyRecord).url);
};

const serializeSeo = (seo: unknown) => {
  if (!seo || typeof seo !== 'object') return null;
  const data = seo as AnyRecord;
  return {
    metaTitle: typeof data.metaTitle === 'string' ? data.metaTitle : null,
    metaDescription: typeof data.metaDescription === 'string' ? data.metaDescription : null,
    ogImage: normalizeMediaSingle(data.ogImage),
  };
};

const serializeCategory = (item: AnyRecord) => ({
  documentId: String(item.documentId ?? ''),
  name: String(item.name ?? ''),
  slug: String(item.slug ?? ''),
  description: typeof item.description === 'string' ? item.description : null,
  sortOrder: parseNumber(item.sortOrder) ?? 0,
  seo: serializeSeo(item.seo),
});

const serializeProduct = (item: AnyRecord) => {
  const sizes = Array.isArray(item.sizes) ? item.sizes : [];
  const options = Array.isArray(item.options) ? item.options : [];
  const deliveryIntervals = Array.isArray(item.deliveryIntervals) ? item.deliveryIntervals : [];
  const category = item.category && typeof item.category === 'object' ? (item.category as AnyRecord) : null;

  return {
    id: String(item.documentId ?? ''),
    slug: String(item.slug ?? ''),
    name: String(item.name ?? ''),
    sku: typeof item.sku === 'string' ? item.sku : '',
    price: parseNumber(item.price) ?? 0,
    originalPrice: parseNumber(item.originalPrice),
    inStock: Boolean(item.inStock),
    images: normalizeMediaList(item.images),
    sizes: sizes
      .map((size, index) => {
        const row = size && typeof size === 'object' ? (size as AnyRecord) : {};
        return {
          id: String(row.id ?? `size-${index}`),
          label: String(row.label ?? ''),
          price: parseNumber(row.price) ?? 0,
          available: Boolean(row.available ?? true),
        };
      })
      .filter((row) => row.label),
    options: options
      .map((option, index) => {
        const row = option && typeof option === 'object' ? (option as AnyRecord) : {};
        return {
          id: String(row.id ?? `option-${index}`),
          name: String(row.name ?? ''),
          price: parseNumber(row.price) ?? 0,
          description: typeof row.description === 'string' ? row.description : null,
        };
      })
      .filter((row) => row.name),
    category: category
      ? {
          name: String(category.name ?? ''),
          slug: String(category.slug ?? ''),
        }
      : null,
    description: typeof item.description === 'string' ? item.description : '',
    composition:
      item.composition && typeof item.composition === 'object'
        ? {
            flowers: Array.isArray((item.composition as AnyRecord).flowers)
              ? (item.composition as AnyRecord).flowers
              : [],
            packaging: Array.isArray((item.composition as AnyRecord).packaging)
              ? (item.composition as AnyRecord).packaging
              : [],
            height:
              typeof (item.composition as AnyRecord).height === 'string'
                ? (item.composition as AnyRecord).height
                : '',
            diameter:
              typeof (item.composition as AnyRecord).diameter === 'string'
                ? (item.composition as AnyRecord).diameter
                : '',
          }
        : null,
    delivery: {
      intervals: deliveryIntervals
        .map((interval) => {
          const row = interval && typeof interval === 'object' ? (interval as AnyRecord) : {};
          return {
            label: String(row.label ?? ''),
            moscow: String(row.moscow ?? ''),
            outsideMkad:
              typeof row.outsideMkad === 'string' ? row.outsideMkad : undefined,
            sortOrder: parseNumber(row.sortOrder) ?? 0,
          };
        })
        .filter((row) => row.label && row.moscow)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(({ sortOrder, ...row }) => row),
    },
    careInstructions:
      typeof item.careInstructions === 'string' ? item.careInstructions : '',
    occasions: Array.isArray(item.occasions) ? item.occasions : [],
    seo: serializeSeo(item.seo),
  };
};

const serializeBanner = (item: AnyRecord) => ({
  documentId: String(item.documentId ?? ''),
  title: String(item.title ?? ''),
  subtitle: typeof item.subtitle === 'string' ? item.subtitle : null,
  kind: typeof item.kind === 'string' ? item.kind : 'home-hero',
  ctaLabel: typeof item.ctaLabel === 'string' ? item.ctaLabel : null,
  ctaUrl: typeof item.ctaUrl === 'string' ? item.ctaUrl : null,
  image: normalizeMediaSingle(item.image),
  sortOrder: parseNumber(item.sortOrder) ?? 0,
  seo: serializeSeo(item.seo),
});

const serializePage = (item: AnyRecord) => ({
  documentId: String(item.documentId ?? ''),
  title: String(item.title ?? ''),
  slug: String(item.slug ?? ''),
  summary: typeof item.summary === 'string' ? item.summary : null,
  content: typeof item.content === 'string' ? item.content : null,
  blocks: item.blocks ?? null,
  seo: serializeSeo(item.seo),
});

const serializeSettings = (item: AnyRecord | null) => {
  if (!item) return null;
  const heroSlides = Array.isArray(item.heroSlides) ? item.heroSlides : [];
  return {
    documentId: String(item.documentId ?? ''),
    brandName: typeof item.brandName === 'string' ? item.brandName : null,
    phone: typeof item.phone === 'string' ? item.phone : null,
    telegram: typeof item.telegram === 'string' ? item.telegram : null,
    whatsapp: typeof item.whatsapp === 'string' ? item.whatsapp : null,
    deliveryNote: typeof item.deliveryNote === 'string' ? item.deliveryNote : null,
    heroTitle: typeof item.heroTitle === 'string' ? item.heroTitle : null,
    heroSubtitle: typeof item.heroSubtitle === 'string' ? item.heroSubtitle : null,
    heroSlides: heroSlides
      .map((slide) => {
        const row = slide && typeof slide === 'object' ? (slide as AnyRecord) : {};
        return {
          title: String(row.title ?? ''),
          subtitle: typeof row.subtitle === 'string' ? row.subtitle : null,
          ctaLabel: typeof row.ctaLabel === 'string' ? row.ctaLabel : null,
          ctaUrl: typeof row.ctaUrl === 'string' ? row.ctaUrl : null,
          sortOrder: parseNumber(row.sortOrder) ?? 0,
          image: normalizeMediaSingle(row.image),
        };
      })
      .filter((row) => row.title)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(({ sortOrder, ...row }) => row),
    seo: serializeSeo(item.seo),
  };
};

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  async findPublicCatalog(query: AnyRecord) {
    const documentsProduct = strapi.documents(PRODUCT_UID) as any;
    const documentsCategory = strapi.documents(CATEGORY_UID) as any;

    const category = typeof query.category === 'string' ? query.category.trim() : '';
    const search = typeof query.search === 'string' ? query.search.trim() : '';

    const filters: AnyRecord = {
      isActive: { $eq: true },
    };

    if (category) {
      filters.category = { slug: { $eq: category } };
    }

    if (search) {
      filters.$or = [
        { name: { $containsi: search } },
        { description: { $containsi: search } },
        { sku: { $containsi: search } },
      ];
    }

    const [categoriesRaw, productsRaw] = await Promise.all([
      documentsCategory.findMany({
        status: 'published',
        filters: { isActive: { $eq: true } },
        sort: ['sortOrder:asc', 'name:asc'],
        populate: {
          seo: { populate: ['ogImage'] },
        },
      }),
      documentsProduct.findMany({
        status: 'published',
        filters,
        sort: ['sortOrder:asc', 'name:asc'],
        populate: {
          category: true,
          images: true,
          sizes: true,
          options: true,
          deliveryIntervals: true,
          composition: true,
          seo: { populate: ['ogImage'] },
        },
      }),
    ]);

    return {
      categories: (categoriesRaw as AnyRecord[]).map(serializeCategory),
      products: (productsRaw as AnyRecord[]).map(serializeProduct),
    };
  },

  async findPublicProductBySlug(slug: string) {
    const documents = strapi.documents(PRODUCT_UID) as any;
    const rows = (await documents.findMany({
      status: 'published',
      filters: {
        slug: { $eq: slug },
        isActive: { $eq: true },
      },
      limit: 1,
      populate: {
        category: true,
        images: true,
        sizes: true,
        options: true,
        deliveryIntervals: true,
        composition: true,
        seo: { populate: ['ogImage'] },
      },
    })) as AnyRecord[];

    return rows[0] ? serializeProduct(rows[0]) : null;
  },

  async findPublicCategories() {
    const documents = strapi.documents(CATEGORY_UID) as any;
    const rows = (await documents.findMany({
      status: 'published',
      filters: { isActive: { $eq: true } },
      sort: ['sortOrder:asc', 'name:asc'],
      populate: {
        seo: { populate: ['ogImage'] },
      },
    })) as AnyRecord[];

    return rows.map(serializeCategory);
  },

  async findPublicBanners() {
    const documents = strapi.documents(BANNER_UID) as any;
    const rows = (await documents.findMany({
      status: 'published',
      filters: { isActive: { $eq: true } },
      sort: ['sortOrder:asc', 'title:asc'],
      populate: {
        image: true,
        seo: { populate: ['ogImage'] },
      },
    })) as AnyRecord[];

    return rows.map(serializeBanner);
  },

  async findPublicPageBySlug(slug: string) {
    const documents = strapi.documents(PAGE_UID) as any;
    const rows = (await documents.findMany({
      status: 'published',
      filters: {
        slug: { $eq: slug },
        isActive: { $eq: true },
      },
      limit: 1,
      populate: {
        seo: { populate: ['ogImage'] },
      },
    })) as AnyRecord[];

    return rows[0] ? serializePage(rows[0]) : null;
  },

  async findPublicSettings() {
    const documents = strapi.documents(SETTINGS_UID) as any;
    const rows = (await documents.findMany({
      status: 'published',
      limit: 1,
      populate: {
        heroSlides: { populate: ['image'] },
        seo: { populate: ['ogImage'] },
      },
    })) as AnyRecord[];

    return serializeSettings(rows[0] ?? null);
  },
});

export default service;
