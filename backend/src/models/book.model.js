const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter the book title"],
    },
    author: {
      type: String,
      required: [true, "Please enter the book author"],
    },
    description: {
      type: String,
      required: [true, "Please enter the book description"],
    },
    category: {
      type: String,
      required: [true, "Please enter the book category"],
    },
    cover: {
      type: String,
      required: [true, "Please enter the book cover"],
    },
    price: {
      type: Number,
      required: [true, "Please enter the book price"],
      min: [0, "Price cannot be negative"],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    stock: {
      type: Number,
      required: [true, "please enter the stock quantity"],
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Book", bookSchema);
