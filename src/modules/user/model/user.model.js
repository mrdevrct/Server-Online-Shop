// user.model.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// لیست فیچرهای پیش‌فرض
const defaultFeatures = [
  { id: 1, feature: "HOME", access: "FULL_ACCESS" },
  { id: 2, feature: "ADD_TICKET", access: "NO_ACCESS" },
  { id: 3, feature: "VIEW_TICKET", access: "FULL_ACCESS" },
  { id: 4, feature: "EDIT_TICKET", access: "FULL_ACCESS" },
  { id: 5, feature: "DELETE_TICKET", access: "FULL_ACCESS" },
  // فیچرهای دیگر را می‌توانید اضافه کنید
];

const featureAccessSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  feature: { type: String, required: true },
  access: {
    type: String,
    enum: ["FULL_ACCESS", "READ_ONLY", "NO_ACCESS"],
    required: true,
  },
});

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    lastName: { type: String },
    firstName: { type: String },
    userType: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    adminStatus: {
      type: String,
      enum: ["USER_REGISTRED", "ADMIN", "NON_ADMIN", "PENDING", "SUPER_ADMIN"],
      default: "USER_REGISTRED",
    },
    featureAccess: [featureAccessSchema],
    profilePath: { type: String, default: "" },
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
    reportCount: { type: Number, default: 0 },
    isBanned: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// هش کردن رمز عبور قبل از ذخیره
userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// بررسی اولین کاربر به‌عنوان SUPER_ADMIN
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const userCount = await mongoose.model("User").countDocuments();
    if (userCount === 0) {
      this.userType = "ADMIN";
      this.adminStatus = "SUPER_ADMIN";
      this.featureAccess = defaultFeatures; // دسترسی‌های پیش‌فرض برای سوپر ادمین
      this.username = "superadmin";
    }
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
