const { bannerController } = require("../controller/banner.controller");
const { createBannerDto, updateBannerDto } = require("../dto/banner.dto");
const validateMiddleware = require("../../../middlewares/validate.middleware");

const bannerRoutes = async (fastify, options) => {
  // دریافت همه بنرها
  fastify.get("/", bannerController.findAll);

  // دریافت بنر با شناسه
  fastify.get("/:id", bannerController.findById);

  // ایجاد بنر
  fastify.post(
    "/",
    { preValidation: [validateMiddleware(createBannerDto)] },
    bannerController.create
  );

  // به‌روزرسانی بنر
  fastify.put(
    "/:id",
    { preValidation: [validateMiddleware(updateBannerDto)] },
    bannerController.update
  );

  // حذف بنر
  fastify.delete("/:id", bannerController.delete);
};

module.exports = bannerRoutes;
