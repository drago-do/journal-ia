const { Router } = require("express");
const router = Router();
const multer = require("multer");
const PDF_File = require("../models/PdfSchema");

//Upload PDF
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, //5MB
  },
});

// Create pdf file for an article
router.post("/:idArticle", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const idArticle = req.params.idArticle;
    const pdf = req.file;
    console.log(pdf);
    const name = req.file.originalname;
    console.log(name);

    const newPDF = new PDF_File({
      article_ref: idArticle,
      name: name,
      pdf_file: {
        data: pdf.buffer,
        contentType: pdf.mimetype,
      },
    });

    const savedPDF = await newPDF.save();
    res.status(200).json({ success: true, data: savedPDF });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get pdf file by id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const pdf = await PDF_File.findById(id).exec();

    if (!pdf) {
      return res.status(404).json({ success: false, message: "PDF not found" });
    }

    res.set({
      "Content-Type": pdf.pdf_file.contentType,
      "Content-Disposition": `attachment; filename=${pdf.name}`,
    });

    res.send(pdf.pdf_file.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/article/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const pdfs = await PDF_File.find({ article_ref: id }).exec();

    // Envía los archivos PDF como respuesta
    pdfs.forEach((pdf) => {
      res.set({
        "Content-Type": pdf.pdf_file.contentType,
        "Content-Disposition": `attachment; filename=${pdf.name}`,
      });
      res.send(pdf.pdf_file.data);
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete pdf file by id
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedPDF = await PDF_File.findByIdAndDelete(id).exec();

    if (!deletedPDF) {
      return res.status(404).json({ success: false, message: "PDF not found" });
    }

    res.status(200).json({ success: true, data: deletedPDF });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete pdf file by article id
router.delete("/article/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedPDFs = await PDF_File.deleteMany({ article_ref: id }).exec();

    res.status(200).json({ success: true, data: deletedPDFs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update pdf file by id
router.put("/:id", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const id = req.params.id;
    const { pdf } = req.file;
    const name = req.file.originalname;

    const updatedPDF = await PDF_File.findByIdAndUpdate(
      id,
      {
        name: name,
        pdf_file: {
          data: pdf.buffer,
          contentType: pdf.mimetype,
        },
      },
      { new: true }
    ).exec();

    if (!updatedPDF) {
      return res.status(404).json({ success: false, message: "PDF not found" });
    }

    res.status(200).json({ success: true, data: updatedPDF });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update pdf file by article id
router.put("/article/:id", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const id = req.params.id;
    const { pdf } = req.file;
    const name = req.file.originalname;

    const updatedPDF = await PDF_File.findOneAndUpdate(
      { article_ref: id },
      {
        name: name,
        pdf_file: {
          data: pdf.buffer,
          contentType: pdf.mimetype,
        },
      },
      { new: true }
    ).exec();

    if (!updatedPDF) {
      return res.status(404).json({ success: false, message: "PDF not found" });
    }

    res.status(200).json({ success: true, data: updatedPDF });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
