if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");

const indexRouter = require("./routes/index");
const authorsRouter = require("./routes/authors");
const booksRouter = require("./routes/books");

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/layout");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;

db.on("error", () => {
  console.error("connection error:");
});
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use("/", indexRouter);
app.use("/authors", authorsRouter);
app.use("/books", booksRouter);

const port = process.env.PORT || 3000;

app.listen(port, console.log("Server listening on port " + port));
