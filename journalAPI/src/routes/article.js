const { Router } = require("express");
const router = Router();
const multer = require("multer");
//Requerir el Schema para CRUD DOCUMENT F_TI_DT_013REV3
const Article = require("../models/ArticleSchema");
const PDF_File = require("../models/PdfSchema");
const User = require("./../models/UserSchema");
const { sendEmailForArticle } = require("./../util/email");

//Create Article
router.post("/", (req, res) => {
  const dataArticle = Article(req.body);
  dataArticle
    .save()
    .then((data) => {
      console.log("datos:");
      console.log(data);
      res.json(data);
    })
    .catch((error) => res.json({ message: error }));
});

//Send retro of an article
router.post("/review/:id", (req, res) => {
  const { id } = req.params;
  sendEmailForArticle(id);
  res.sendStatus(200);
});

//Get all Articles's
router.get("/", (req, res) => {
  Article.find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//Get one Article by id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  Article.findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//Update full DOCUMENT by id
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const dataArticle = Article(req.body);
  Article.findByIdAndUpdate(id, dataArticle, { new: true })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//Delete DOCUMENT by id
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  deletePDFFile(id);
  Article.findByIdAndDelete(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//Upload PDF
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, //5MB
  },
});

//Get articles of author
router.get("/author/:id", (req, res) => {
  const { id } = req.params;
  Article.find({ author: id })
    .then((data) => res.json(data))
    .catch((error) => res.json({ successful: false, message: error }));
});

router.post("/upload_pdf/:id", upload.single(), (req, res) => {
  const pdf = req.file;
  const { id } = req.params;
  const newPdf = new PDF_File({
    article_ref: id,
    name: pdf.originalname,
    pdf_file: {
      data: pdf.buffer,
      contentType: pdf.mimetype,
    },
  });
  newPdf
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//get PDF

router.get("/download_pdf/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const pdf = await PDF_File.find({ id });
    res.set({
      "Content-Type": pdf[0].pdf_file.contentType,
    });
    res.send(pdf[0].pdf_file.data);
  } catch (error) {
    res.json({ message: error });
  }
});

//Método get regresa verdadero si existe un pdf para ese id
router.get("/article_pdf/exists/:id", (req, res) => {
  const { id } = req.params;
  PDF_File.exists({ article_ref: id })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//Método para eliminar registro con el id

router.delete("/article_pdf/:id", (req, res) => {
  const { id } = req.params;
  PDF_File.findOneAndDelete({ article_ref: id })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

function deletePDFFile(id) {
  //Eliminar todas las imágenes de la base de datos que coincidan con linkTo
  PDF_File.findOneAndDelete({ article_ref: id })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return error;
    });
}

//ruta para agregar comentario de revisores
router.put("/add_comment/:idArticle", (req, res) => {
  const { idArticle } = req.params;
  const { idUser, comments } = req.body;
  //Obtener id, usuario que hizo el comentario
  User.findOne({ _id: idUser })
    .then((dataUser) => {
      const { _id, name } = dataUser;
      //Agregar comentario al documento
      Article.findOneAndUpdate(
        { _id: idArticle },
        {
          $push: {
            comments: {
              _id: _id,
              name: name,
              comments: comments,
            },
          },
        }
      )
        //Responde con el status 200
        .then((dataComments) => res.status(200).json(dataComments))
        .catch((error) => res.json({ message: error }));
    })
    .catch((error) => res.json({ message: error }));
});

//Para cambiar el status de un articulo "partial_reject"
router.put("/change_status/:idArticle", (req, res) => {
  const { idArticle } = req.params;
  const { status } = req.body;
  try {
    //Verifica si el estado del articulo es "partial_reject"
    if (status === "partial_reject") {
      //Si es "partial_reject" se elimina el pdf en el que idArticle == article_ref
      deletePDFFile(idArticle);
    }

    //Actualiza el status del articulo
    Article.findOneAndUpdate(
      { _id: idArticle },
      {
        $set: {
          status: status,
        },
      }
    )
      .then((data) => res.status(200).json(data))
      .catch((error) => res.json({ message: error }));
  } catch (error) {
    res.json({ message: error });
  }
});

//Para obtener el status de un articulo
router.get("/get_status/:idArticle", (req, res) => {
  const { idArticle } = req.params;
  Article.find({ _id: idArticle })
    .then((data) => res.status(200).json(data))
    .catch((error) => res.json({ message: error }));
});

module.exports = router;
