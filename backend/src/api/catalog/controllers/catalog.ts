import type { Core } from '@strapi/strapi';

type AnyRecord = Record<string, unknown>;

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return 'Unexpected error';
};

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  async findPublic(ctx: any) {
    try {
      const service = strapi.service('api::catalog.catalog') as {
        findPublicCatalog: (query: AnyRecord) => Promise<unknown>;
      };
      const data = await service.findPublicCatalog((ctx.query ?? {}) as AnyRecord);
      return ctx.send({ ok: true, data });
    } catch (error) {
      strapi.log.error(`[catalog:findPublic] ${getErrorMessage(error)}`);
      return ctx.send({ ok: false, error: getErrorMessage(error) }, 400);
    }
  },

  async findProduct(ctx: any) {
    try {
      const slug = String(ctx.params?.slug ?? '').trim();
      if (!slug) return ctx.send({ ok: false, error: 'slug is required' }, 400);

      const service = strapi.service('api::catalog.catalog') as {
        findPublicProductBySlug: (slug: string) => Promise<unknown>;
      };
      const data = await service.findPublicProductBySlug(slug);
      if (!data) return ctx.send({ ok: false, error: 'Not found' }, 404);
      return ctx.send({ ok: true, data });
    } catch (error) {
      strapi.log.error(`[catalog:findProduct] ${getErrorMessage(error)}`);
      return ctx.send({ ok: false, error: getErrorMessage(error) }, 400);
    }
  },

  async findCategories(ctx: any) {
    try {
      const service = strapi.service('api::catalog.catalog') as {
        findPublicCategories: () => Promise<unknown>;
      };
      const data = await service.findPublicCategories();
      return ctx.send({ ok: true, data });
    } catch (error) {
      strapi.log.error(`[catalog:findCategories] ${getErrorMessage(error)}`);
      return ctx.send({ ok: false, error: getErrorMessage(error) }, 400);
    }
  },

  async findBanners(ctx: any) {
    try {
      const service = strapi.service('api::catalog.catalog') as {
        findPublicBanners: () => Promise<unknown>;
      };
      const data = await service.findPublicBanners();
      return ctx.send({ ok: true, data });
    } catch (error) {
      strapi.log.error(`[catalog:findBanners] ${getErrorMessage(error)}`);
      return ctx.send({ ok: false, error: getErrorMessage(error) }, 400);
    }
  },

  async findPage(ctx: any) {
    try {
      const slug = String(ctx.params?.slug ?? '').trim();
      if (!slug) return ctx.send({ ok: false, error: 'slug is required' }, 400);

      const service = strapi.service('api::catalog.catalog') as {
        findPublicPageBySlug: (slug: string) => Promise<unknown>;
      };
      const data = await service.findPublicPageBySlug(slug);
      if (!data) return ctx.send({ ok: false, error: 'Not found' }, 404);
      return ctx.send({ ok: true, data });
    } catch (error) {
      strapi.log.error(`[catalog:findPage] ${getErrorMessage(error)}`);
      return ctx.send({ ok: false, error: getErrorMessage(error) }, 400);
    }
  },

  async findSettings(ctx: any) {
    try {
      const service = strapi.service('api::catalog.catalog') as {
        findPublicSettings: () => Promise<unknown>;
      };
      const data = await service.findPublicSettings();
      return ctx.send({ ok: true, data });
    } catch (error) {
      strapi.log.error(`[catalog:findSettings] ${getErrorMessage(error)}`);
      return ctx.send({ ok: false, error: getErrorMessage(error) }, 400);
    }
  },
});

export default controller;
