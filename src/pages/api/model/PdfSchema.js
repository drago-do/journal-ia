// models/PdfSchema.js

const mongoose = require("mongoose");

const PdfSchema = new mongoose.Schema({
  article_ref: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "articles",
    required: true,
  },
  pdf_file: {
    data: Buffer,
    contentType: String,
  },
});

module.exports = mongoose.model("PDF_File", PdfSchema);
