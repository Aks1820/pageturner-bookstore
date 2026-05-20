const jwt = require("jsonwebtoken");

/*
 Generate JWT Token
 Creates authentication token for user
*/

function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15d",
    },
  );
}

module.exports = generateToken;
