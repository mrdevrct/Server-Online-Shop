const User = require("../model/user.model");
const { sendVerificationCode } = require("../../../common/helpers/email");
const bcrypt = require("bcrypt");
const logger = require("../../../common/logger/winston");

// لیست فیچرهای پیش‌فرض برای کاربران عادی
const defaultUserFeatures = [
  { id: 1, feature: "HOME", access: "FULL_ACCESS" },
  { id: 2, feature: "ADD_TICKET", access: "NO_ACCESS" },
  { id: 3, feature: "VIEW_TICKET", access: "NO_ACCESS" },
  { id: 4, feature: "EDIT_TICKET", access: "NO_ACCESS" },
  { id: 5, feature: "DELETE_TICKET", access: "NO_ACCESS" },
];

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateDefaultUsername = () => {
  const date = new Date();
  const dateString = date.toISOString().slice(0, 10).replace(/-/g, "");
  return `user-${dateString}`;
};

const userService = {
  // ثبت‌نام یا ورود با ایمیل
  auth: async ({ email }) => {
    try {
      let user = await User.findOne({ email });
      const code = generateVerificationCode();
      const expires = new Date(Date.now() + 10 * 60 * 1000);

      if (!user) {
        let username = generateDefaultUsername();
        let usernameIndex = 1;
        while (await User.findOne({ username })) {
          username = `${generateDefaultUsername()}-${usernameIndex}`;
          usernameIndex++;
        }

        user = new User({
          username,
          email,
          verificationCode: code,
          verificationCodeExpires: expires,
          featureAccess: defaultUserFeatures,
        });
        logger.info(`New user created: ${email} with username ${username}`);
      } else {
        user.verificationCode = code;
        user.verificationCodeExpires = expires;
        logger.info(`Login attempt for existing user: ${email}`);
      }

      await user.save();
      try {
        await sendVerificationCode(user.email, code);
      } catch (emailError) {
        logger.warn(
          `Failed to send verification email to ${user.email}: ${emailError.message}`
        );
        logger.info(`Verification code for ${user.email}: ${code}`);
      }
      return user;
    } catch (error) {
      logger.error(`Error in auth: ${error.message}`);
      throw error;
    }
  },

  // تأیید کد
  verifyCode: async ({ email, code }) => {
    const user = await User.findOne({
      email,
      verificationCode: code,
      verificationCodeExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new Error("Invalid or expired verification code");
    }

    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    user.adminStatus =
      user.adminStatus === "PENDING" ? "USER_REGISTRED" : user.adminStatus;
    await user.save();

    return user;
  },

  // ورود با رمز عبور
  loginWithPassword: async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      throw new Error("Invalid credentials or password not set");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    return user;
  },

  // به‌روزرسانی پروفایل
  updateProfile: async (userId, profileData) => {
    const updateData = { ...profileData };
    if (profileData.password) {
      updateData.password = await bcrypt.hash(profileData.password, 10);
    }
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
  },

  // دریافت پروفایل
  getProfile: async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },

  // به‌روزرسانی دسترسی‌های فیچر
  updateFeatureAccess: async (userId, featureAccessData) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    featureAccessData.forEach((newAccess) => {
      const feature = user.featureAccess.find(
        (f) => f.feature === newAccess.feature
      );
      if (feature) {
        feature.access = newAccess.access;
      } else {
        user.featureAccess.push(newAccess);
      }
    });

    await user.save();
    return user;
  },

  // دریافت اطلاعات کاربر لاگین‌شده
  getCurrentUser: async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },

  // دریافت لیست کاربران
  getUsers: async (currentUserId) => {
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      throw new Error("Current user not found");
    }

    let query = { _id: { $ne: currentUserId } }; // حذف کاربر فعلی از لیست
    if (currentUser.adminStatus === "ADMIN") {
      query.adminStatus = { $ne: "SUPER_ADMIN" }; // حذف سوپر ادمین برای ادمین‌ها
    }

    const users = await User.find(query).select(
      "_id username email lastName firstName userType adminStatus profilePath reportCount isBanned featureAccess"
    );

    return users.map((user) => ({
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
    }));
  },

  // دریافت کاربر با شناسه
  findById: async (id) => {
    return await User.findById(id);
  },
};

module.exports = { userService };
