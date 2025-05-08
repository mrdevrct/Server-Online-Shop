const setupInterceptors = (fastify) => {
  // مدیریت پاسخ‌ها
  fastify.addHook("onSend", async (request, reply, payload) => {
    const response = {
      ...JSON.parse(payload || "{}"),
    };
    return JSON.stringify(response);
  });

  // مدیریت خطاها
  fastify.setErrorHandler((error, request, payload) => {
    const response = {
      ...JSON.parse(payload || "{}"),
    };
    return JSON.stringify(response);
  });
};

module.exports = { setupInterceptors };
