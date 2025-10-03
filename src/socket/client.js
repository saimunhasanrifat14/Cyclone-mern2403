const { io } = require("socket.io-client");

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  query: { id: "123" },
});

// client-side
socket.on("connect", () => {
  console.log("😊😊 connected to server");
});

socket.on("cart", (data) => {
  console.log("from server", data);
});

// disconnect
socket.on("disconnect", () => {
  console.log("❌ Disconnected from server");
});

// error
socket.on("connect_error", (err) => {
  console.error("⚠️ Connection error:", err.message);
});
