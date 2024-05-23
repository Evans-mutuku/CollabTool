// server/routes/docRoutes.js
const express = require("express");
const router = express.Router();
const Document = require("../models/Document");

const {
  createDocument,
  getDocuments,
} = require("../countrollers/docController");
const auth = require("../middleware/auth");

// Create a new document
router.post("/create", async (req, res) => {
  const { title } = req.body;
  const newDocument = new Document({ title, content: "" });
  await newDocument.save();
  res.status(201).json(newDocument);
});

// Get all documents
router.get("/", async (req, res) => {
  const documents = await Document.find({});
  res.json(documents);
});

// router.post("/documents", auth, createDocument);
// router.get("/documents", auth, getDocuments);

module.exports = router;
