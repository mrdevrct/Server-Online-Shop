const validateMiddleware = (schema) => {
  return async (request, reply) => {
    try {
      await schema.parseAsync(request.body);
    } catch (error) {
      reply.status(400).send({
        success: false,
        error: "Validation failed",
        details: error.errors,
      });
    }
  };
};

module.exports = validateMiddleware;
