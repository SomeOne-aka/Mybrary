const express = require("express");
const router = express.Router();
const Book = require("./../models/book");

router.get("/", async (req, res) => {
  let books;
  try {
    books = await Book.find().sort({ createdAt: -1 }).limit(10);
  } catch (error) {
    books = [];
  }

  res.render("index", { books });
});

module.exports = router;
