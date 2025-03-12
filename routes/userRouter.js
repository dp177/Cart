const express = require("express");
const router = express.Router();
const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const {generateToken}=require("../utils/generateToken")
const {registerUser}=require("../controllers/authController");
const {loginUser}=require("../controllers/authController");
const {logout}=require("../controllers/authController");
router.get("/", (req, res) => {
    console.log("✅ GET /users hit");
    res.send("Users Home");
});

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/logout",logout);
//router.get("/logout",logout);
module.exports = router;
