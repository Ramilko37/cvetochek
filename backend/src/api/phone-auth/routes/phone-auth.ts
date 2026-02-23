/** @type {import('@strapi/strapi').Core.RouterConfig} */
export default {
  type: 'content-api',
  routes: [
    {
      method: 'POST',
      path: '/phone-auth/send-otp',
      handler: 'api::phone-auth.phone-auth.sendOtp',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/phone-auth/verify-otp',
      handler: 'api::phone-auth.phone-auth.verifyOtp',
      config: { auth: false },
    },
  ],
};
