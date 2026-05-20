const jwt = require("jsonwebtoken");

// Verify JWT token
async function authMiddleware(req, res, next) {
  // Get token from cookies or authorization header
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access",
    });
  }

  try {
    // Decode and verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data to request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}

module.exports = {
  authMiddleware,
};
