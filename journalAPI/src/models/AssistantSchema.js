// models/Article.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AssistantSchema = new Schema({
  article_ref: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "articles",
    required: true,
  },
  abstract_opinion: { type: String, required: true },
  category_opinion: {
    type: String,
    required: true,
  },
  transcript_pdf: {
    type: String,
    required: true,
  },
  general_opinion: { type: String, required: true },
  specific_opinion: { type: [[String]] },
  final_eval: { type: String },
});

const AssistantOpinion = mongoose.model("AssistantOpinion", AssistantSchema);

module.exports = AssistantOpinion;
