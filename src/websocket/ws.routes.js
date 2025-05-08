const wsHandler = require("./ws.handler");

const websocketPlugin = async (fastify, opts) => {
  fastify.register(require("@fastify/websocket"));

  fastify.get("/ws", { websocket: true }, wsHandler.handleConnection);
};

module.exports = websocketPlugin;
