const bookService = require("../services/book.service");

// Get all books
async function getAllBooks(req, res) {
  try {
    const data = await bookService.getAllBooks(req.query);

    return res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// Get single book by ID
async function getBookById(req, res) {
  try {
    const book = await bookService.getBookById(req.params.id);

    return res.status(200).json({
      success: true,
      book,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}

// Create new book
async function createBook(req, res) {
  try {
    // Use uploaded image or image URL
    const coverUrl = req.file ? req.file.path : req.body.cover;

    const book = await bookService.createBook(req.body, coverUrl);

    return res.status(201).json({
      success: true,
      message: "Book created successfully",
      book,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// Update existing book
async function updateBook(req, res) {
  try {
    // Use uploaded image or existing image URL
    const coverUrl = req.file ? req.file.path : req.body.cover;

    const book = await bookService.updateBook(
      req.params.id,
      req.body,
      coverUrl,
    );

    return res.status(200).json({
      success: true,
      message: "Book updated successfully",
      book,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// Delete book
async function deleteBook(req, res) {
  try {
    await bookService.deleteBook(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
