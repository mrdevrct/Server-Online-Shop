const fastify = require("fastify")({ logger: false }); // غیرفعال کردن لاگر داخلی Fastify
const path = require("path");
const { connectDB } = require("./configs/database");
const { setupInterceptors } = require("./interceptors");
const { setupMiddlewares } = require("./middlewares");
const { setupRoutes } = require("./modules");
const websocketPlugin = require("./websocket");
const logger = require("./common/logger/winston");

// ثبت پلاگین‌ها
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/public/",
});

fastify.register(require("@fastify/cors"), {
  origin: true, // یا به جای true بنویس ['http://localhost:3000']
  credentials: true,
});

// ثبت WebSocket
fastify.register(websocketPlugin);

fastify.addHook('onRequest', (request, reply, done) => {
  logger.debug(`Incoming request: ${request.method} ${request.url}`);
  done();
});

// هوک برای لاگ کردن درخواست‌ها
fastify.addHook("onResponse", (request, reply, done) => {
  try {
    const ping = reply.getResponseTime();
    logger.info("Request completed", {
      method: request.method,
      url: request.url,
      status: reply.statusCode,
      ping: ping.toFixed(2),
    });
    done();
  } catch (error) {
    logger.error(`Error in onResponse hook: ${error.message}`);
    done(error);
  }
});

// تنظیمات میدلورها و اینترسپتورها
setupMiddlewares(fastify);
setupInterceptors(fastify);

// ثبت روت‌های ماژول‌ها
setupRoutes(fastify);

module.exports = fastify;
