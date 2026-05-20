const userModel = require("../models/user.model");

const bcrypt = require("bcryptjs");

const generateToken = require("../utils/generate.token");

// Register new user
async function registerUser(data) {
  const { name, email, password, role } = data;

  // Check if user already exists
  const existingUser = await userModel.findOne({
    email,
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await userModel.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  // Generate JWT token
  const token = generateToken(user);

  // Return safe user data
  return {
    token,

    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

// Login existing user
async function loginUser(data) {
  const { email, password } = data;

  // Find user with password
  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare passwords
  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT token
  const token = generateToken(user);

  // Return safe user data
  return {
    token,

    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

module.exports = {
  registerUser,
  loginUser,
};
