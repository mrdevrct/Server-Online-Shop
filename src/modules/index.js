const userRoutes = require("./user/user.routes");
const bannerRoutes = require("./banner/banner.routes");

const setupRoutes = (fastify) => {
  fastify.register(userRoutes, { prefix: "/api/users" });
  fastify.register(bannerRoutes, { prefix: "/api/banners" });
};

module.exports = { setupRoutes };
