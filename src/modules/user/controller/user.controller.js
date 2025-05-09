const { userService } = require("../service/user.service");
const { formatResponse } = require("../../../common/helpers/formatResponse");
const logger = require("../../../common/logger/winston");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const userController = {
  // ثبت‌نام یا ورود با ایمیل
  auth: async (request, reply) => {
    try {
      const user = await userService.auth(request.body);
      logger.info(`Auth processed for: ${user.email}`);
      return formatResponse(
        { message: "Verification code sent to your email" },
        false,
        null,
        201
      );
    } catch (error) {
      logger.error(`Error in auth: ${error.message}`);
      return formatResponse({}, true, error.message, 400);
    }
  },

  // تأیید کد
  verifyCode: async (request, reply) => {
    try {
      const user = await userService.verifyCode(request.body);
      const token = generateToken(user);
      logger.info(`User verified: ${user.email}`);
      return formatResponse({
        id: user._id,
        username: user.username,
        email: user.email,
        userType: user.userType,
        adminStatus: user.adminStatus,
        token,
      });
    } catch (error) {
      logger.error(`Error verifying code: ${error.message}`);
      return formatResponse({}, true, error.message, 400);
    }
  },

  // ورود با رمز عبور
  loginWithPassword: async (request, reply) => {
    try {
      const user = await userService.loginWithPassword(request.body);
      const token = generateToken(user);
      logger.info(`User logged in: ${user.email}`);
      return formatResponse({
        id: user._id,
        username: user.username,
        email: user.email,
        userType: user.userType,
        adminStatus: user.adminStatus,
        token,
      });
    } catch (error) {
      logger.error(`Error logging in: ${error.message}`);
      return formatResponse({}, true, error.message, 400);
    }
  },

  // به‌روزرسانی پروفایل
  updateProfile: async (request, reply) => {
    try {
      const user = await userService.updateProfile(
        request.user.id,
        request.body
      );
      if (!user) {
        return formatResponse({}, true, "User not found", 404);
      }
      logger.info(`User profile updated: ${user.email}`);
      return formatResponse({
        id: user._id,
        username: user.username,
        email: user.email,
        lastName: user.lastName,
        firstName: user.firstName,
        userType: user.userType,
        adminStatus: user.adminStatus,
        profilePath: user.profilePath,
        reportCount: user.reportCount,
        isBanned: user.isBanned,
      });
    } catch (error) {
      logger.error(`Error updating profile: ${error.message}`);
      return formatResponse({}, true, error.message, 400);
    }
  },

  // دریافت پروفایل
  getProfile: async (request, reply) => {
    try {
      const user = await userService.getProfile(request.user.id);
      logger.info(`Profile retrieved: ${user.email}`);
      return formatResponse({
        id: user._id,
        username: user.username,
        email: user.email,
        lastName: user.lastName,
        firstName: user.firstName,
        userType: user.userType,
        adminStatus: user.adminStatus,
        profilePath: user.profilePath,
        reportCount: user.reportCount,
        isBanned: user.isBanned,
      });
    } catch (error) {
      logger.error(`Error retrieving profile: ${error.message}`);
      return formatResponse({}, true, error.message, 400);
    }
  },
};

module.exports = { userController };
