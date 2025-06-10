const express = require("express");
const cors = require("cors");
const http = require("http");

const app = express();
const server = http.createServer(app);
const PORT = 3001;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const io = require("socket.io")(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`✅ Socket connected: ${socket.id}`);

  socket.on("join_club", (club_id) => {
    socket.join(`club_${club_id}`);
    console.log(`🟢 Joined room: club_${club_id}`);
  });

   socket.on("join_channel", (channelId) => {
    const roomName = `channel_${channelId}`;
    socket.join(roomName);
    console.log(`🟢 Socket ${socket.id} joined room: ${roomName}`);
  });

  socket.on("leave_channel", (channelId) => {
    const roomName = `channel_${channelId}`;
    socket.leave(roomName);
    console.log(`🚪 Socket ${socket.id} left room: ${roomName}`);
  });

      socket.on("new_message", async(msg) => {
        const { text, user_id, channel_id, club_id, channel, club_name, message_id } = msg;

      if (!channel_id || !club_id) {
          console.error("Message missing channel_id or club_id:", msg);
          return;
        }

      io.to(`club_${club_id}`).emit("receiveMessage", {
          ...msg,
          club_name,
          channel,
          message_id
        });
        console.log(`📨 Message broadcasted to club_${club_id} (from channel_${channel_id}): ${text}`);
      });


  socket.on("new_announcement", (data) => {
    const { club_id, title, message, created_at } = data;

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
