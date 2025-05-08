const handleConnection = (connection, req) => {
  connection.socket.on("message", (message) => {
    // مدیریت پیام‌های WebSocket
    connection.socket.send(`Received: ${message}`);
  });

  connection.socket.on("close", () => {
    console.log("WebSocket connection closed");
  });
};

module.exports = { handleConnection };
