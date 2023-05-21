// models/User.js
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
  revisor_name: { type: [Schema.Types.ObjectId], ref: "users" },
  revisor_comments: [{ type: [[Schema.Types.ObjectId, String]] }],
  admin_comments: { type: String },
  status: {
    type: String,
    enum: ["wait_revisor", "wait_admin", "published", "reject"],
    default: "wait_revisor",
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Article", ArticleSchema);
