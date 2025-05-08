const setupInterceptors = (fastify) => {
  fastify.addHook("onSend", async (request, reply, payload) => {
    const response = {
      success: true,
      data: JSON.parse(payload || "{}"),
      timestamp: new Date().toISOString(),
    };
    return JSON.stringify(response);
  });
};

module.exports = { setupInterceptors };
