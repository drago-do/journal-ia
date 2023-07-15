const { Router } = require("express");
const router = Router();
const Assistant = require("../models/AssistantSchema");
const Article = require("../models/ArticleSchema");
const assistant = require("../util/assistant");
const parsePDF = require("./../util/transcript");

// Obtener respuesta de prueba
router.get("/", async (req, res) => {
  const { articleID } = req.body;

  try {
    // Obtener el artículo de la base de datos con ese id
    const article = await Article.findById(articleID);
    if (!article) {
      // Manejar el caso en el que no se encuentre el artículo
      return res.status(404).json({ message: "El artículo no existe" });
    }

    // Rescatar el abstract si está presente en el artículo
    const abstract = article.abstract || "";

    // Enviar el abstract al asistente
    const [abstractOpinion, themeOpinion] = await assistant.getAbstractOpinion(
      abstract
    );

    res.json({
      abstractOpinionResponse: abstractOpinion,
      themeOpinionResponse: themeOpinion,
    });
  } catch (error) {
    // Manejar errores de base de datos u otras excepciones
    res
      .status(500)
      .json({ message: "Error al obtener la respuesta", error: error.message });
  }
});

//Obtener transcripción del pdf
router.get("/transcript/", async (req, res) => {
  const { idPDF, idArticle } = req.body;
  try {
    //Obtener el articulo de la base de datos
    const article = await Article.findById(idArticle);
    const fullPDFData = await parsePDF.getTranscriptPDF(idPDF);
    const transcriptPDF = fullPDFData.text;
    const abstractGPTCriticAndTheme = await getAbstractGPT(article.abstract);
    const abstractGPTCritic = abstractGPTCriticAndTheme[0];
    const themeGPTCritic = abstractGPTCriticAndTheme[1];
    const generalGTPOpinion = await getGeneralGPT(transcriptPDF);
    const opinionPerPageGTPOpinion = await getOpinionPerPageGPT(transcriptPDF);
    const newAssistant = new Assistant({
      article_ref: idArticle,
      abstract_opinion: abstractGPTCritic,
      category_opinion: themeGPTCritic,
      transcript_pdf: transcriptPDF,
      general_opinion: generalGTPOpinion,
      specific_opinion: opinionPerPageGTPOpinion,
      final_eval: "test",
    });
    const savedAssistant = await newAssistant.save();
    res.status(200).json({ success: true, data: savedAssistant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

//!Métodos que llaman a CHAT-GPT
//Obtener opinion del abstract del articulo
const getAbstractGPT = (abstract) => {
  return new Promise((resolve, reject) => {
    assistant
      .getAbstractOpinion(abstract)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//Obtener opinion general de la transcripción
const getGeneralGPT = (transcript) => {
  return new Promise((resolve, reject) => {
    assistant
      .getGeneralOpinion(transcript)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//Obtener opinion por pagina de la transcripción
const getOpinionPerPageGPT = (transcript) => {
  return new Promise((resolve, reject) => {
    assistant
      .getPerPageOpinion(transcript)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//Exportar modulo
module.exports = router;
