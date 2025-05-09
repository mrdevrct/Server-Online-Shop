const cron = require("node-cron");
const Banner = require("../../modules/banner/model/banner.model");
const logger = require("../logger/winston");

const setupCronJobs = () => {
  // هر روز در نیمه‌شب اجرا شود
  cron.schedule("0 0 * * *", async () => {
    try {
      const result = await Banner.deleteMany({
        expirationDate: { $lt: new Date() },
      });
      logger.info(`Deleted ${result.deletedCount} expired banners`);
    } catch (error) {
      logger.error(`Error deleting expired banners: ${error.message}`);
    }
  });
};

module.exports = { setupCronJobs };
