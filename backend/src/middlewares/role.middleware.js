function authorizeRoles(...roles) {
  return (req, res, next) => {
    const userRole = req.user.role;

    // Check if user has required role
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();
  };
}

module.exports = authorizeRoles;
