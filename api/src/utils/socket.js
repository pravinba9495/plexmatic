const io = require("socket.io")(3000, {
  cookie: false,
  serveClient: true,
});

console.log("Socket Server running on 3000");

io.on("connect", (socket) => {
  socket.emit("message", {
    type: "status",
    data: {
      connected: true,
    },
  });
  console.log("Client Connected");
});

const emit = (data) => {
  io.emit("message", data);
};

module.exports = {
  emit,
};
