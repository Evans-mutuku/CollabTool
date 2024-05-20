// server/models/Document.js
const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  versionHistory: [
    {
      content: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Document", DocumentSchema);
