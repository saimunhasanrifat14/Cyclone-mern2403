let io = null;
const { Server } = require("socket.io");
const { customError } = require("../utils/customError");

module.exports = {
  initSocket: (hostServer) => {
    io = new Server(hostServer, {
      cors: {
        origin: ["http://localhost:5173"],
      },
    });

    // connection
    io.on("connection", (socket) => {
      const userId = socket.handshake.query.id;
      if (userId) {
        socket.join(userId);
      }
      // error
      socket.on("disconnect", () => {
        console.log("User disconnected:");
      });
    });

    io.on("error", (error) => {
      console.error("Socket.IO error:", error);
      throw new customError("Socket.IO error " + error, 500);
    });
  },
  getIo: () => {
    if (!io) throw new customError("Socket.io not initialized!");
    return io;
  },
};
