const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const docRoutes = require("./routes/docRoutes");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
const Document = require("./models/Document"); // Import the Document model

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

connectDB();

app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, "../client")));

app.use("/api/auth", authRoutes);
app.use("/api/docs", docRoutes);

// Route to serve index.html for root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

// Endpoint to create a new document
app.post("/api/docs/create", async (req, res) => {
  const { title } = req.body;
  const newDocument = new Document({ title, content: "" });
  await newDocument.save();
  res.json(newDocument);
});

// Endpoint to get a specific document by ID
app.get("/api/docs/:id", async (req, res) => {
  const { id } = req.params;
  const document = await Document.findById(id);
  res.json(document);
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join", async (docId) => {
    socket.join(docId);
    console.log(`Client joined room: ${docId}`);

    // Load the document content from the database
    const document = await Document.findById(docId);
    if (document) {
      socket.emit("receiveEdit", document.content);
    }
  });

  socket.on("edit", async (data) => {
    const { docId, content } = data;

    // Save or update the document content in the database
    const document = await Document.findById(docId);
    if (document) {
      document.content = content;
      document.versionHistory.push({ content });
      await document.save();
    }

    // Broadcast the changes to other clients in the same room
    socket.to(docId).emit("receiveEdit", content);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
