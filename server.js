const express = require("express");
const cors = require("cors");
const http = require("http");

const app = express();
const server = http.createServer(app);
const PORT = 3002;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// SOCKET.IO SETUP
const io = require("socket.io")(server, {
  cors: {
    origin: "*", // Adjust for prod
    methods: ["GET", "POST"]
  }
});

// SOCKET.IO CONNECTIONS
io.on("connection", (socket) => {
  console.log(`✅ Socket connected: ${socket.id}`);

  // Join club room
  socket.on("join_club", (club_id) => {
    socket.join(`club_${club_id}`);
    console.log(`🟢 Joined room: club_${club_id}`);
  });

  // When an announcement is sent
  socket.on("new_announcement", (data) => {
    const { club_id, title, message, created_at } = data;

    // Broadcast to the room
    io.to(`club_${club_id}`).emit("announcement_received", {
      title,
      message,
      created_at,
    });

    console.log(`📢 Announcement to club_${club_id}: ${title}`);
  });

  socket.on("disconnect", () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running at http://localhost:${PORT}`);
});
