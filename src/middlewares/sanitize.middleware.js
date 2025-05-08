const sanitizeHtml = require("sanitize-html");

const sanitizeMiddleware = async (request, reply) => {
  const sanitizeObject = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === "string") {
        obj[key] = sanitizeHtml(obj[key], {
          allowedTags: [], // هیچ تگ HTML مجاز نیست
          allowedAttributes: {}, // هیچ صفت HTML مجاز نیست
        });
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  };

  if (request.body) {
    sanitizeObject(request.body);
  }

  if (request.body[key] !== sanitizedValue) {
    logger.warn(`Potential XSS attempt detected in input: ${request.body[key]}`);
  }

  return;
};

module.exports = sanitizeMiddleware;
