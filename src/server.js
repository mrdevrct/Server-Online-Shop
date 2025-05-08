const fastify = require("./app");
const { setupCronJobs } = require("./common/cron/cron");
const { connectDB } = require("./configs/database");

const start = async () => {
  try {
    await connectDB(); // اتصال به MongoDB
    await fastify.listen({ port: process.env.PORT || 8080 });
    setupCronJobs();
    console.log("Server running on port", process.env.PORT || 8080);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
