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
        featureAccess: user.featureAccess,
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
        featureAccess: user.featureAccess,
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
        featureAccess: user.featureAccess,
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
        featureAccess: user.featureAccess,
      });
    } catch (error) {
      logger.error(`Error retrieving profile: ${error.message}`);
      return formatResponse({}, true, error.message, 400);
    }
  },

  // به‌روزرسانی دسترسی‌های فیچر
  updateFeatureAccess: async (request, reply) => {
    try {
      const user = await userService.updateFeatureAccess(
        request.user.id,
        request.body
      );
      logger.info(`Feature access updated for user: ${user.email}`);
      return formatResponse({
        id: user._id,
        username: user.username,
        email: user.email,
        featureAccess: user.featureAccess,
      });
    } catch (error) {
      logger.error(`Error updating feature access: ${error.message}`);
      return formatResponse({}, true, error.message, 400);
    }
  },

  // دریافت اطلاعات کاربر لاگین‌شده
  getCurrentUser: async (request, reply) => {
    try {
      const user = await userService.getCurrentUser(request.user.id);
      logger.info(`Current user retrieved: ${user.email}`);
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
        featureAccess: user.featureAccess,
      });
    } catch (error) {
      logger.error(`Error retrieving current user: ${error.message}`);
      return formatResponse({}, true, error.message, 400);
    }
  },

  // دریافت لیست کاربران
  getUsers: async (request, reply) => {
    try {
      const users = await userService.getUsers(request.user.id);
      logger.info(`User list retrieved by user: ${request.user.id}`);
      return formatResponse(users);
    } catch (error) {
      logger.error(`Error retrieving users: ${error.message}`);
      return formatResponse({}, true, error.message, 400);
    }
  },
};

module.exports = { userController };
