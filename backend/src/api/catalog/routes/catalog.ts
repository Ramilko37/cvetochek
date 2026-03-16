/** @type {import('@strapi/strapi').Core.RouterConfig} */
export default {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/catalog/public',
      handler: 'api::catalog.catalog.findPublic',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/catalog/public/products/:slug',
      handler: 'api::catalog.catalog.findProduct',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/catalog/public/categories',
      handler: 'api::catalog.catalog.findCategories',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/catalog/public/banners',
      handler: 'api::catalog.catalog.findBanners',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/catalog/public/pages/:slug',
      handler: 'api::catalog.catalog.findPage',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/catalog/public/settings',
      handler: 'api::catalog.catalog.findSettings',
      config: { auth: false },
    },
  ],
};
