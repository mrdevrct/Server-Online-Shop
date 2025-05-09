const userRoutes = require("./user/routes/user.routes");
const bannerRoutes = require("./banner/routes/banner.routes");
const reportRoutes = require("./report/routes/report.routes");

const setupRoutes = (fastify) => {
  fastify.register(userRoutes, { prefix: "/api/users" });
  fastify.register(bannerRoutes, { prefix: "/api/banners" });
  fastify.register(reportRoutes, { prefix: "/api/reports" });
};

module.exports = { setupRoutes };
