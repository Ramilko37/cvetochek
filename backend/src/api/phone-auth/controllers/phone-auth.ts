export default {
  async sendOtp(ctx: { request?: { body?: { phone?: string } }; send: (body: unknown, status?: number) => void }) {
    const phone = (ctx.request?.body as { phone?: string })?.phone;
    if (typeof phone !== "string" || !phone.trim()) {
      return ctx.send({ error: "Телефон обязателен" }, 400);
    }
    const digits = phone.replace(/\D/g, "");
    const normalized = digits.startsWith("8") ? "7" + digits.slice(1) : digits.length > 0 && digits[0] !== "7" ? "7" + digits : digits;
    const normalizedFull = normalized.slice(0, 11);
    if (normalizedFull.length !== 11 || !normalizedFull.startsWith("7")) {
      return ctx.send({ error: "Введите корректный российский номер (+7)" }, 400);
    }

    const otpStore = (globalThis as unknown as { __otpStore?: Map<string, { code: string; expiresAt: number }> }).__otpStore;
    const rateLimitStore = (globalThis as unknown as { __rateLimitStore?: Map<string, number> }).__rateLimitStore;
    if (!otpStore || !rateLimitStore) return ctx.send({ error: "Server error" }, 500);

    const now = Date.now();
    const lastSent = rateLimitStore.get(normalizedFull);
    const OTP_RATE_LIMIT_MS = 60 * 1000;
    if (lastSent && now - lastSent < OTP_RATE_LIMIT_MS) {
      const waitSec = Math.ceil((OTP_RATE_LIMIT_MS - (now - lastSent)) / 1000);
      return ctx.send({ error: `Повторите через ${waitSec} сек` }, 429);
    }

    const code = String(Math.floor(1000 + Math.random() * 9000)).slice(0, 4);
    const OTP_TTL_MS = 5 * 60 * 1000;
    otpStore.set(normalizedFull, { code, expiresAt: now + OTP_TTL_MS });
    rateLimitStore.set(normalizedFull, now);

    const apiKey = process.env.EXOLVE_API_KEY?.trim();
    const sender = process.env.EXOLVE_SENDER?.trim(); // номер или альфа-имя отправителя
    if (!apiKey || !sender) {
      otpStore.delete(normalizedFull);
      rateLimitStore.delete(normalizedFull);
      return ctx.send({ error: "SMS не настроен (EXOLVE_API_KEY, EXOLVE_SENDER)" }, 500);
    }
    const text = `Цветочек в Горшочек. Код: ${code}`;
    try {
      const res = await fetch("https://api.exolve.ru/messaging/v1/SendSMS", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          number: sender,
          destination: normalizedFull,
          text,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { message_id?: string; error?: string };
      if (res.ok && data.message_id) {
        return ctx.send({ ok: true });
      }
      otpStore.delete(normalizedFull);
      rateLimitStore.delete(normalizedFull);
      const errMsg = typeof data === "object" && data !== null && "error" in data ? String(data.error) : `HTTP ${res.status}`;
      return ctx.send({ error: errMsg || "Ошибка отправки SMS" }, res.ok ? 500 : res.status);
    } catch (e) {
      otpStore.delete(normalizedFull);
      rateLimitStore.delete(normalizedFull);
      return ctx.send({ error: (e as Error).message }, 500);
    }
  },

  async verifyOtp(ctx: { request?: { body?: { phone?: string; code?: string } }; send: (body: unknown, status?: number) => void }) {
    const body = ctx.request?.body as { phone?: string; code?: string } | undefined;
    const phone = body?.phone;
    const code = body?.code?.trim?.();
    if (typeof phone !== "string" || !phone.trim()) {
      return ctx.send({ error: "Телефон обязателен" }, 400);
    }
    if (typeof code !== "string" || code.length !== 4) {
      return ctx.send({ error: "Введите код из SMS" }, 400);
    }
    const digits = phone.replace(/\D/g, "");
    const normalized = digits.startsWith("8") ? "7" + digits.slice(1) : digits.length > 0 && digits[0] !== "7" ? "7" + digits : digits;
    const normalizedFull = normalized.slice(0, 11);

    const otpStore = (globalThis as unknown as { __otpStore?: Map<string, { code: string; expiresAt: number }> }).__otpStore;
    if (!otpStore) return ctx.send({ error: "Server error" }, 500);

    const stored = otpStore.get(normalizedFull);
    if (!stored) {
      return ctx.send({ error: "Код истёк. Запросите новый" }, 400);
    }
    if (Date.now() > stored.expiresAt) {
      otpStore.delete(normalizedFull);
      return ctx.send({ error: "Код истёк. Запросите новый" }, 400);
    }
    if (stored.code !== code) {
      return ctx.send({ error: "Неверный код" }, 400);
    }
    otpStore.delete(normalizedFull);

    const strapi = (globalThis as unknown as { __strapi?: { plugin: (n: string) => { service: (s: string) => unknown } } }).__strapi;
    if (!strapi) return ctx.send({ error: "Server error" }, 500);

    const userPlugin = strapi.plugin("users-permissions");
    const userService = userPlugin.service("user") as {
      fetchAll?: (params: { filters?: Record<string, unknown> }) => Promise<{ results?: Array<{ id: number; username?: string }> }>;
      add?: (data: Record<string, unknown>) => Promise<{ id: number; username?: string; email?: string }>;
    };
    const jwtService = userPlugin.service("jwt") as { issue: (params: { id: number }) => Promise<string> };

    let user: { id: number; username?: string } | undefined;
    if (userService.fetchAll) {
      const existing = await userService.fetchAll({ filters: { phone: normalizedFull } });
      user = existing?.results?.[0];
    }

    if (!user && userService.add) {
      const username = `user_${normalizedFull}`;
      const email = `${normalizedFull}@cvetochek.local`;
      const randomPassword = require("crypto").randomBytes(32).toString("hex");
      user = await userService.add({
        username,
        email,
        password: randomPassword,
        phone: normalizedFull,
        confirmed: true,
        provider: "phone",
        role: 1,
      } as Record<string, unknown>);
    }

    if (!user) {
      return ctx.send({ error: "Не удалось создать пользователя" }, 500);
    }
    const jwt = await jwtService.issue({ id: user.id });
    return ctx.send({
      jwt,
      user: {
        id: user.id,
        phone: normalizedFull,
        username: user.username,
      },
    });
  },
};
