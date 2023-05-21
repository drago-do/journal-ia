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
router.get("/transcript/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const transcript = await parsePDF.getTranscriptPDF(id);
    res.status(200).json({ success: true, data: transcript });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

//Exportar modulo
module.exports = router;
