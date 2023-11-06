const express = require("express");
const router = express.Router();
const Author = require("./../models/author");

// All authors routes
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    console.log(searchOptions);
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
    res.redirect(`/authors`);
  } catch (error) {
    res.render("authors/new", {
      author,
      errorMessage: "Error creating author",
    });
  }
});

module.exports = router;
