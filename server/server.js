// server/server.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const docRoutes = require("./routes/docRoutes");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

connectDB();

app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/docs", docRoutes);

app.use(express.static(path.join(__dirname, "../client")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join", (docId) => {
    socket.join(docId);
    console.log(`Client joined room: ${docId}`);
  });

  socket.on("edit", (data) => {
    const { docId, content } = data;
    io.to(docId).emit("receiveEdit", content);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
