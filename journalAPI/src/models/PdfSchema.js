// models/PdfSchema.js

const mongoose = require("mongoose");

const PdfSchema = new mongoose.Schema({
  article_ref: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "articles",
    required: true,
  },
  name: { type: String },
  pdf_file: {
    data: Buffer,
    contentType: String,
  },
});

const PDF_File = mongoose.model("PDF_File", PdfSchema);

module.exports = PDF_File;
