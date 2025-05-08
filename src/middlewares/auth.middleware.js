const jwt = require("jsonwebtoken");
const { formatResponse } = require("../common/helpers/formatResponse");
const logger = require("../common/logger/winston");

const authMiddleware = async (request, reply) => {
  try {
    const token = request.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return reply
        .status(401)
        .send(formatResponse({}, true, "No token provided", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.user = decoded;

    // بررسی توکن CSRF برای درخواست‌های غیر-GET
    if (["POST", "PUT", "DELETE"].includes(request.method)) {
      await request.csrfProtection();
    }

    if (request.body[key] !== sanitizedValue) {
      logger.warn(`Potential XSS attempt detected in input: ${request.body[key]}`);
    }
  } catch (error) {
    return reply
      .status(401)
      .send(formatResponse({}, true, "Invalid or expired token", 401));
  }
};

module.exports = authMiddleware;
