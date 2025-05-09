const { userController } = require("../controller/user.controller");
const {
  authDto,
  verifyCodeDto,
  loginWithPasswordDto,
  updateProfileDto,
} = require("../dto/user.dto");
const validateMiddleware = require("../../../middlewares/validate.middleware");
const authMiddleware = require("../../../middlewares/auth.middleware");

const userRoutes = async (fastify, options) => {
  // ثبت‌نام یا ورود با ایمیل
  fastify.post(
    "/auth",
    { preValidation: [validateMiddleware(authDto)] },
    userController.auth
  );

  // تأیید کد
  fastify.post(
    "/verify",
    { preValidation: [validateMiddleware(verifyCodeDto)] },
    userController.verifyCode
  );

  // ورود با رمز عبور
  fastify.post(
    "/login",
    { preValidation: [validateMiddleware(loginWithPasswordDto)] },
    userController.loginWithPassword
  );

  // به‌روزرسانی پروفایل
  fastify.put(
    "/profile",
    { preValidation: [fastify.auth, validateMiddleware(updateProfileDto)] },
    userController.updateProfile
  );

  // دریافت پروفایل
  fastify.get(
    "/profile",
    { preValidation: [fastify.auth] },
    userController.getProfile
  );
};

module.exports = userRoutes;
