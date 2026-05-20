const express = require("express");

const router = express.Router();

const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/book.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");

const authorizeRoles = require("../middlewares/role.middleware");

const upload = require("../middlewares/upload.middleware");

// Public routes
router.get("/", getAllBooks);
router.get("/:id", getBookById);

// Admin routes
router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  upload.single("cover"),
  createBook,
);

router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  upload.single("cover"),
  updateBook,
);

router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteBook);

module.exports = router;
