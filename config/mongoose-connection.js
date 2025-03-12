require("dotenv").config();
const mongoose = require("mongoose");
const dbgr = require("debug")("development:mongoose");

mongoose.connect(process.env.MONGODB_URI)
    .then(() => dbgr("Connected to MongoDB Atlas"))
    .catch(err => console.log("MongoDB Connection Error:", err));

module.exports = mongoose.connection;
