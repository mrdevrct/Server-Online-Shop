const winston = require("winston");
const emoji = require("node-emoji");

// فرمت تاریخ و زمان به صورت محلی
const formatTimestamp = () =>
  new Date().toLocaleString("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

// ایجاد لاگر
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.printf(({ level, message, timestamp, ...metadata }) => {
      let emojiIcon = "";
      let logMessage = "";

      // انتخاب آیکون بر اساس سطح لاگ
      switch (level) {
        case "info":
          emojiIcon = emoji.get("information_source");
          break;
        case "error":
          emojiIcon = emoji.get("exclamation");
          break;
        case "warn":
          emojiIcon = emoji.get("warning");
          break;
        default:
          emojiIcon = emoji.get("grey_question");
      }

      // اگر لاگ مربوط به درخواست HTTP باشد
      if (metadata.method && metadata.url) {
        const statusIcon =
          metadata.status >= 400
            ? emoji.get("x")
            : emoji.get("white_check_mark");
        const methodIcon =
          {
            GET: emoji.get("mag"),
            POST: emoji.get("new"),
            PUT: emoji.get("pencil2"),
            DELETE: emoji.get("wastebasket"),
          }[metadata.method] || emoji.get("question");

        logMessage = `${emojiIcon} [${level.toUpperCase()}] ${formatTimestamp()} | ${methodIcon} ${
          metadata.method
        } ${metadata.url} | ${statusIcon} Status: ${
          metadata.status
        } | ⏱️ Ping: ${metadata.ping}ms`;
      } else {
        logMessage = `${emojiIcon} [${level.toUpperCase()}] ${formatTimestamp()} | ${message}`;
      }

      return logMessage;
    })
  ),
  transports: [
    new winston.transports.Console(), // لاگ در کنسول
    new winston.transports.File({ filename: "logs/error.log", level: "error" }), // لاگ خطاها در فایل
    new winston.transports.File({ filename: "logs/combined.log" }), // تمام لاگ‌ها در فایل
  ],
});

// ایجاد پوشه logs اگر وجود نداشته باشد
const fs = require("fs");
if (!fs.existsSync("logs")) {
  fs.mkdirSync("logs");
}

module.exports = logger;
