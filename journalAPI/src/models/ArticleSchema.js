// models/Article.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: { type: String, required: true, unique: true },
  abstract: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  category: {
    type: String,
    enum: [
      "Ingeniería Civil",
      "Ciencias en Alimentos",
      "Administración",
      "Logística",
      "Turismo",
      "Industria 4.0",
      "Investigación Educativa",
      "Ciencias Básicas",
      "Sistemas Computacionales",
      "Mecatronica",
      "Electromecánica",
      "Gestión Empresarial",
    ],
    required: true,
  },
  pdf_file: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "pdf_Files",
  },
  status: {
    type: String,
    enum: ["wait_revisor", "partial_reject", "published", "reject"],
    default: "wait_revisor",
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Article = mongoose.model("articles", ArticleSchema);

module.exports = Article;
