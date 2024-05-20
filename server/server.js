const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Passport configuration
require("./config/passport")(passport);

// Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/documents", require("./routes/documents"));

// Socket.io event handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-document", (documentId) => {
    socket.join(documentId);
    console.log(`User ${socket.id} joined document ${documentId}`);
  });

  socket.on("leave-document", (documentId) => {
    socket.leave(documentId);
    console.log(`User ${socket.id} left document ${documentId}`);
  });

  socket.on("send-changes", ({ documentId, changes }) => {
    io.to(documentId).emit("receive-changes", changes);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
