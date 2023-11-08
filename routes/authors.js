const express = require("express");
const router = express.Router();
const Author = require("./../models/author");
const Book = require("./../models/book");

// All authors routes
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const authors = await Author.find(searchOptions);
    res.render("authors/index", { authors, searchOptions: req.query });
  } catch (error) {
    res.redirect("/");
  }
});

//New author routes
router.get("/new", (req, res) => {
  res.render("authors/new", { author: new Author() });
});

// Create author route
router.post("/", (req, res) => {
  const author = new Author({
    name: req.body.name,
  });

  //! No longer accepted
  // author.save((error, savedAuthor) => {
  //   if (error) {
  //     console.log(error);
  //     res.render("authors/new", {
  //       author,
  //       errorMessage: "Error creating author",
  //     });
  //   } else {
  //     // res.redirect(`/authors/${savedAuthor.id}`);
  //     res.redirect(`/authors`);
  //   }
  // });

  //! then catch
  author
    .save()
    .then((savedAuthor) => {
      // res.redirect(`/authors/${savedAuthor.id}`);
      res.redirect(`/authors`);
    })
    .catch((error) => {
      console.log(error);
      res.render("authors/new", {
        author,
        errorMessage: "Error creating author",
      });
    });
});

router.post("/", async (req, res) => {
  const author = new Author({
    name: req.body.name,
  });

  try {
    const savedAuthor = await author.save();
    res.redirect(`/authors/${savedAuthor.id}`);
  } catch (error) {
    res.render("authors/new", {
      author,
      errorMessage: "Error creating author",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    const books = await Book.find({ author: req.params.id }).limit(6);

    res.render("authors/show", {
      author,
      booksByAuthor: books,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/authors");
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render("authors/edit", { author });
  } catch (error) {
    console.log(error);
    res.redirect("/authors");
  }
});

router.put("/:id", async (req, res) => {
  let author;

  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;
    await author.save();
    res.redirect(`/authors`);
  } catch (error) {
    console.log(error);
    if (author == null) {
      res.redirect("/");
    } else {
      res.render("authors/edit", {
        author,
        errorMessage: "Error Updating author",
      });
    }
  }
});

router.delete("/:id", async (req, res) => {
  let author;

  try {
    let authorHasBooks = await Book.find({ author: req.params.id });

    if (authorHasBooks.length > 0) {
      res.redirect("/authors"); // with mesage
    } else {
      author = await Author.deleteOne({ _id: req.params.id });
      res.redirect("/authors");
    }
  } catch (error) {
    console.log(error);
    if (author == null) {
      res.redirect("/");
    } else {
      res.redirect(`/authors/${author.id}`);
    }
  }
});

module.exports = router;
