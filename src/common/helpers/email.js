const nodemailer = require("nodemailer");
const logger = require("../logger/winston");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.mailtrap.io",
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // برای پورت 587 از TLS استفاده می‌شود
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: true,
    minVersion: "TLSv1.2",
  },
});

const sendVerificationCode = async (email, code) => {
  try {
    await transporter.sendMail({
      from: `"Shop Server" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "کد تأیید ورود/ثبت‌نام",
      html: `<p>کد تأیید شما: <strong>${code}</strong></p><p>این کد تا 10 دقیقه معتبر است.</p>`,
    });
    logger.info(`Verification code sent to ${email}`);
  } catch (error) {
    logger.error(`Error sending email to ${email}: ${error.message}`);
    throw new Error("Failed to send verification code");
  }
};

module.exports = { sendVerificationCode };
