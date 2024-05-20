// server/routes/docRoutes.js
const express = require("express");
const router = express.Router();
const {
  createDocument,
  getDocuments,
} = require("../controllers/docController");
const auth = require("../middleware/auth");

router.post("/documents", auth, createDocument);
router.get("/documents", auth, getDocuments);

module.exports = router;
