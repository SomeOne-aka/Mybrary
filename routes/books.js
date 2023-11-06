const express = require("express");
const router = express.Router();
const Book = require("./../models/book");
const Author = require("./../models/author");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const uploadPath = path.join("public", Book.coverImageBasePath);
const imageMemeType = ["images/jpg", "images/jpeg", "images/png", "images/gif"];
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, cb) => {
    cb(null, imageMemeType);
  },
});

// All book routes
router.get("/", async (req, res) => {
  let query = Book.find({});

  if (req.query.title != null && req.query.title != "") {
    query = query.where("title").regex(new RegExp(req.query.title, "i"));
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != "") {
    query = query.lte("publishDate", req.query.publishedBefore);
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != "") {
    query = query.where("publishDate").gte(req.query.publishedAfter);
  }

  try {
    const books = await query;
    res.render("books/index", {
      books,
      searchOptions: req.query,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

//New book route
router.get("/new", async (req, res) => {
  renderNewPage(res, new Book());
});

// Create books route
router.post("/", upload.single("cover"), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    coverImageName: fileName,
    description: req.body.description,
  });
  try {
    const newBook = await book.save();
    res.redirect("/books");
  } catch (error) {
    if (book.coverImageName) {
      removeBookCover(book.coverImageName);
    }
    renderNewPage(res, book, true);
  }
});

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors,
      book,
    };
    if (hasError) params.errorMessage = "Error creating book";
    res.render("books/new", params);
  } catch (error) {
    res.redirect("/");
  }
}

function removeBookCover(fileName) {
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    if (err) console.error(err);
  });
}

module.exports = router;
