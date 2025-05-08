const { createUserDto } = require("./user.dto");
const { userController } = require("./user.controller");
const validateMiddleware = require("../../middlewares/validate.middleware");

const userRoutes = async (fastify, options) => {
  fastify.post(
    "/",
    { preValidation: [validateMiddleware(createUserDto)] },
    userController.create
  );
  fastify.get("/", userController.findAll);
};

module.exports = userRoutes;
