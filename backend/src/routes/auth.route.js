const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
} = require("../controllers/auth.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", authMiddleware, getProfile);

router.get("/logout", authMiddleware, logoutUser);

module.exports = router;
