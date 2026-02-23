import type { Core } from '@strapi/strapi';

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    (globalThis as unknown as { __strapi?: Core.Strapi; __otpStore?: Map<string, { code: string; expiresAt: number }>; __rateLimitStore?: Map<string, number> }).__strapi = strapi;
    (globalThis as unknown as { __otpStore?: Map<string, { code: string; expiresAt: number }> }).__otpStore = new Map();
    (globalThis as unknown as { __rateLimitStore?: Map<string, number> }).__rateLimitStore = new Map();

    // Включить phone-auth для Public (избегаем 401)
    try {
      const role = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
      if (role) {
        const perms = await strapi.db.query('plugin::users-permissions.permission').findMany({ where: { role: role.id } });
        const phoneAuthPerms = perms.filter((p: { action?: string }) => p.action?.includes('phone-auth'));
        for (const p of phoneAuthPerms) {
          await strapi.db.query('plugin::users-permissions.permission').update({ where: { id: p.id }, data: { enabled: true } });
        }
      }
    } catch {
      // игнорируем — права можно выдать вручную в админке
    }
  },
};
