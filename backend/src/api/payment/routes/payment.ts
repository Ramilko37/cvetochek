/** @type {import('@strapi/strapi').Core.RouterConfig} */
export default {
  type: 'content-api',
  routes: [
    {
      method: 'POST',
      path: '/payments/robokassa/init',
      handler: 'api::payment.payment.init',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/payments/robokassa/result',
      handler: 'api::payment.payment.result',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/payments/robokassa/result',
      handler: 'api::payment.payment.result',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/payments/robokassa/success',
      handler: 'api::payment.payment.success',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/payments/robokassa/success',
      handler: 'api::payment.payment.success',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/payments/robokassa/fail',
      handler: 'api::payment.payment.fail',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/payments/robokassa/fail',
      handler: 'api::payment.payment.fail',
      config: { auth: false },
    },
  ],
};
