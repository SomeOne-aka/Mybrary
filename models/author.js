const mongoose = require("mongoose");
const Book = require("./book");

const authorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

authorSchema.pre("deleteOne", function (next) {
  console.log(this.id);
  Book.find({ author: this.id })
    .then((books) => {
      if (books.length > 0) {
        console.log("exist beachhhh");
        next(new Error("Cannot delete author with books"));
      } else {
        console.log("no exist beachhhh");
        next();
      }
    })
    .catch((err) => next(err));
});

module.exports = mongoose.model("Author", authorSchema);
