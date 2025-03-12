const express = require("express");
const router = express.Router(); // ✅ Define router

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload; // ✅ Export router
