const websocketPlugin = async (fastify, opts) => {
  fastify.register(require("@fastify/websocket"));
  fastify.get("/ws", { websocket: true }, (connection, req) => {
    connection.socket.on("message", (message) => {
      connection.socket.send(`Received: ${message}`);
    });
  });
};

module.exports = websocketPlugin;
