// models/Article.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentOfRevisorSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  id_user: {
    type: mongoose.Schema.Types.ObjectId,
  },
  commentForAuthor: { type: String, required: true },
  commentForAdmin: {
    type: String,
    required: true,
  },
  specific_questions: { type: [String] },
  article_ref: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "articles",
    index: false,
  },
});

const CommentOfRevisor = mongoose.model(
  "CommentOfRevisor",
  CommentOfRevisorSchema
);

module.exports = CommentOfRevisor;
