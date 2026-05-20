const mongoose = require("mongoose");

// Connect to MongoDB database
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB");

    process.exit(1);
  }
}

module.exports = connectDB;
