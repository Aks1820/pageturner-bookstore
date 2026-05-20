const Book = require("../models/book.model");

// Get all books with filters and pagination
async function getAllBooks(query) {
  const { search, category, sort, page = 1, limit = 10 } = query;

  let filter = {};

  // Search by title or author
  if (search) {
    filter.$or = [
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },
      {
        author: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  // Filter by category
  if (category && category !== "All") {
    filter.category = category;
  }

  // Sorting options
  let sortOption = {};

  if (sort === "price_asc") {
    sortOption = { price: 1 };
  } else if (sort === "price_desc") {
    sortOption = { price: -1 };
  } else if (sort === "rating") {
    sortOption = { rating: -1 };
  } else {
    sortOption = { createdAt: -1 };
  }

  const books = await Book.find(filter)
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Book.countDocuments(filter);

  return {
    books,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
  };
}

// Create new book
async function createBook(data, coverUrl) {
  const bookData = { ...data };

  if (coverUrl) {
    bookData.cover = coverUrl;
  }

  const book = await Book.create(bookData);

  return book;
}

// Get single book by ID
async function getBookById(id) {
  const book = await Book.findOne({
    _id: id,
  });

  if (!book) {
    throw new Error("Book not found");
  }

  return book;
}

// Update existing book
async function updateBook(id, data, coverUrl) {
  const updateData = { ...data };

  if (coverUrl) {
    updateData.cover = coverUrl;
  }

  const book = await Book.findOneAndUpdate({ _id: id }, updateData, {
    new: true,
  });

  if (!book) {
    throw new Error("Book not found");
  }

  return book;
}

// Delete book
async function deleteBook(id) {
  const book = await Book.findOneAndDelete({
    _id: id,
  });

  if (!book) {
    throw new Error("Book not found");
  }

  return book;
}

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
