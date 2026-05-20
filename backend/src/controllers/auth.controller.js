const authService = require("../services/auth.service");

// Cookie settings
const cookieOptions = {
  httpOnly: true,
  secure: false, // true in production
  maxAge: 15 * 24 * 60 * 60 * 1000,
};

// Register user
async function registerUser(req, res) {
  try {
    const data = await authService.registerUser(req.body);

    // Save JWT in cookie
    res.cookie("token", data.token, cookieOptions);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: data.user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// Login user
async function loginUser(req, res) {
  try {
    const data = await authService.loginUser(req.body);

    // Save JWT in cookie
    res.cookie("token", data.token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: data.user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// Get logged in user profile
async function getProfile(req, res) {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
}

// Logout user
async function logoutUser(req, res) {
  // Remove token cookie
  res.clearCookie("token");

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
};
