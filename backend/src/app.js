const express = require("express");

const cookieParser = require("cookie-parser");

const cors = require("cors");

const authRoutes = require("./routes/auth.route");

const bookRoutes = require("./routes/book.route");

const cartRoutes = require("./routes/cart.route");

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

app.use(cookieParser());

// API routes
app.use("/api/auth", authRoutes);

app.use("/api/books", bookRoutes);

app.use("/api/cart", cartRoutes);

module.exports = app;
