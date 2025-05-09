const authMiddleware = require("./auth.middleware");
const rateLimit = require("@fastify/rate-limit");
const helmet = require("helmet");

const setupMiddlewares = (fastify) => {
  // ثبت Helmet برای امنیت
  fastify.register(helmet);

  // ثبت Rate Limit برای محدود کردن درخواست‌ها
  fastify.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  // ثبت میدلور احراز هویت به‌صورت دکوراتور (برای استفاده در روت‌ها)
  fastify.decorate("auth", authMiddleware);
};

module.exports = { setupMiddlewares };
