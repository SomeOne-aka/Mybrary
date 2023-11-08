const express = require("express");
const router = express.Router();
const Book = require("./../models/book");
const Author = require("./../models/author");
const imageMemeTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif"];

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
router.post("/", async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description,
  });

  saveCover(book, req.body.cover);

  try {
    const newBook = await book.save();
    res.redirect(`/books/${newBook.id}`);
  } catch (error) {
    renderNewPage(res, book, true);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("author");
    console.log(book);
    res.render("books/show", {
      book,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    renderEditPage(res, book);
  } catch (error) {
    res.redirect("/");
  }
});

router.put("/:id", async (req, res) => {
  let book;

  try {
    book = await Book.findById(req.params.id);
    book.title = req.body.title;
    book.author = req.body.author;
    book.publishDate = req.body.publishDate;
    book.pageCount = req.body.pageCount;
    book.description = req.body.description;

    saveCover(book, req.body.cover);

    await book.save();
    res.redirect(`/books/${book.id}`);
  } catch (error) {
    if (book != null) {
      renderEditPage(res, book, true);
    } else {
      res.redirect("/");
    }
  }
});

router.delete("/:id", async (req, res) => {
  let book;

  try {
    book = await Book.findByIdAndDelete(req.params.id);
    res.redirect("/books");
  } catch (error) {
    if (book != null) {
      res.render("books/show", {
        book,
        errorMessage: "Error deleting book",
      });
    } else {
      res.redirect("/");
    }
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

function saveCover(book, coverEncoded) {
  if (coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMemeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, "base64");
    book.coverImageType = cover.type;
  }
}

async function renderEditPage(res, book, hasError = false) {
  try {
    const authors = await Author.find();
    let params = {
      authors,
      book,
    };
    if (hasError) params.errorMessage = "Error creating Book";
    res.render("books/edit", params);
  } catch (error) {
    res.redirect("/");
  }
}

module.exports = router;
