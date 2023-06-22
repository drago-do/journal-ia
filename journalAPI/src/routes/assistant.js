const { Router } = require("express");
const router = Router();
const Assistant = require("../models/AssistantSchema");
const Article = require("../models/ArticleSchema");
const assistant = require("../util/assistant");
const parsePDF = require("./../util/transcript");
const PDF_File = require("./../models/PdfSchema");

router.post("/create-transcript/:articleID", async (req, res) => {
  const { articleID } = req.params;
  try {
    const pdfFile = await PDF_File.findOne({ article_ref: articleID });
    // Si no se encuentra el PDF_file, retornar un error
    if (!pdfFile) {
      return res.status(404).json({ message: "El PDF no existe" });
    }
    const transcriptPDF = await parsePDF.getTranscriptPDF(pdfFile._id);
    // Crear un nuevo Assistant con los datos obtenidos
    const newAssistant = new Assistant({
      article_ref: articleID,
      transcript_pdf: transcriptPDF.text,
    });
    await newAssistant.save();
    res.json({ message: "Assistant creado" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el Assistant", error: error });
  }
});

router.get("/get-transcript/:articleID", async (req, res) => {
  const { articleID } = req.params;

  try {
    const assistant = await Assistant.findOne({ article_ref: articleID });

    // Si no se encuentra el Assistant, retornar un error
    if (!assistant) {
      return res.status(404).json({ message: "El Assistant no existe" });
    }

    const { transcript_pdf } = assistant;

    res.json({ transcript_pdf });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la transcripción" });
  }
});

router.put("/abstractAndTheme/:articleID", async (req, res) => {
  const { articleID } = req.params;

  try {
    // Obtener el artículo de la base de datos con ese id
    const article = await Article.findById(articleID);

    if (!article) {
      // Manejar el caso en el que no se encuentre el artículo
      return res.status(404).json({ message: "El artículo no existe" });
    }

    // Obtener los temas y abstract de GPT3
    const abstractGPTCriticAndTheme = await getAbstractGPT(article.abstract);
    const abstractGPTCritic = abstractGPTCriticAndTheme[0];
    const abstractGPTTheme = abstractGPTCriticAndTheme[1];

    // Actualizar la opinión del abstract y el tema en el Assistant correspondiente
    const assistant = await Assistant.findOneAndUpdate(
      { article_ref: articleID },
      {
        abstract_opinion: abstractGPTCritic,
        category_opinion: abstractGPTTheme,
      },
      { new: true }
    );

    if (!assistant) {
      // Manejar el caso en el que no se encuentre el Assistant
      return res.status(404).json({ message: "El Assistant no existe" });
    }

    res.json({ message: "Opinión del abstract y tema guardados" });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la opinión del abstract y tema",
      error: error.message,
    });
  }
});

router.get("/abstractAndTheme/:articleID", async (req, res) => {
  const { articleID } = req.params;
  try {
    // Buscar el Assistant correspondiente al articleID
    const assistant = await Assistant.findOne({ article_ref: articleID });

    if (!assistant) {
      // Manejar el caso en el que no se encuentre el Assistant
      return res.status(404).json({ message: "El Assistant no existe" });
    }

    // Obtener la opinión del abstract y el tema del Assistant
    const abstractOpinion = assistant.abstract_opinion;
    const themeOpinion = assistant.category_opinion;

    res.json({ abstractOpinion, themeOpinion });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la opinión del abstract y tema",
      error: error.message,
    });
  }
});

router.put("/generalOpinion/:articleID", async (req, res) => {
  const { articleID } = req.params;
  //Obtener el objeto Assistant de la base de datos donde articleID = article_ref
  try {
    const assistant = await Assistant.findOne({ article_ref: articleID });
    if (!assistant.transcript_pdf) {
      // Manejar el caso en el que no se encuentre el Assistant
      return res
        .status(404)
        .json({ message: "El Assistant no existe o no tiene transcripción." });
    }
    //Obtener la transcripción del Assistant
    const transcript = assistant.transcript_pdf;
    //Obtener la opinión general de la transcripción
    const generalOpinion = await getGeneralGPT(transcript);
    //Actualizar la opinión general del Assistant
    await Assistant.findOneAndUpdate(
      { article_ref: articleID },
      { general_opinion: generalOpinion }
    );
    res.json({ message: "Opinión general guardada" });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la opinión general",
      error: error.message,
      fullError: error,
    });
  }
});

router.get("/generalOpinion/:articleID", async (req, res) => {
  const { articleID } = req.params;

  try {
    // Buscar el Assistant correspondiente al articleID
    const assistant = await Assistant.findOne({ article_ref: articleID });

    if (!assistant) {
      // Manejar el caso en el que no se encuentre el Assistant
      return res.status(404).json({ message: "El Assistant no existe" });
    }

    // Obtener la opinión general del Assistant
    const generalOpinion = assistant.general_opinion;

    res.json({ generalOpinion });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la opinión general",
      error: error.message,
    });
  }
});

router.put("/opinionPerPage/:articleID", async (req, res) => {
  const { articleID } = req.params;
  //Obtener el objeto Assistant de la base de datos donde articleID = article_ref
  try {
    const assistant = await Assistant.findOne({ article_ref: articleID });
    if (!assistant.transcript_pdf) {
      // Manejar el caso en el que no se encuentre el Assistant
      return res
        .status(404)
        .json({ message: "El Assistant no existe o no tiene transcripción." });
    }
    //Obtener la transcripción del Assistant
    const transcript = assistant.transcript_pdf;
    //Obtener la opinión por página de la transcripción
    const opinionPerPageGTPOpinion = await getOpinionPerPageGPT(transcript);
    console.log(opinionPerPageGTPOpinion);
    //Actualizar la opinión por página del Assistant
    await Assistant.findOneAndUpdate(
      { article_ref: articleID },
      { specific_opinion: opinionPerPageGTPOpinion }
    );
    res.json({ message: "Opinión por página guardada" });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la opinión por página",
      error: error.message,
    });
  }
});

router.get("/opinionPerPage/:articleID", async (req, res) => {
  const { articleID } = req.params;

  try {
    // Buscar el Assistant correspondiente al articleID
    const assistant = await Assistant.findOne({ article_ref: articleID });

    if (!assistant || !assistant.specific_opinion) {
      // Manejar el caso en el que no se encuentre el Assistant o no tenga opinión por página
      return res.status(404).json({
        message: "El Assistant no existe o no tiene opinión por página.",
      });
    }

    // Obtener la opinión por página del Assistant
    const opinionPerPage = assistant.specific_opinion;

    res.json({ opinionPerPage });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la opinión por página",
      error: error.message,
    });
  }
});

router.put("/finalEval/:articleID", async (req, res) => {
  const { articleID } = req.params;
  //Obtener el objeto Assistant de la base de datos donde articleID = article_ref
  try {
    const assistant = await Assistant.findOne({ article_ref: articleID });
    if (!assistant.general_opinion) {
      // Manejar el caso en el que no se encuentre el Assistant
      return res.status(404).json({
        message: "El Assistant no existe o no tiene Opinion General.",
      });
    }
    //Obtener la opinión general de assistant
    const generalOpinion = assistant.general_opinion;
    const finalEval = await getFinalEval(generalOpinion);
    //Actualizar la opinión general del Assistant
    await Assistant.findOneAndUpdate(
      { article_ref: articleID },
      { final_eval: finalEval }
    );
    res.json({ message: "Evaluación final guardada" });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la opinión general",
      error: error.message,
    });
  }
});

router.get("/finalEval/:articleID", async (req, res) => {
  const { articleID } = req.params;
  try {
    // Buscar el Assistant correspondiente al articleID
    const assistant = await Assistant.findOne({ article_ref: articleID });
    if (!assistant.final_eval) {
      // Manejar el caso en el que no se encuentre el Assistant o no tenga evaluación final
      return res.status(404).json({
        message: "El Assistant no existe o no tiene evaluación final.",
      });
    }
    // Obtener la evaluación final del Assistant
    const finalEval = assistant.final_eval;
    res.json({ finalEval });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la evaluación final",
      error: error.message,
    });
  }
});

router.get("/:articleID", async (req, res) => {
  const { articleID } = req.params;
  try {
    // Buscar el Assistant correspondiente al articleID
    const assistant = await Assistant.findOne({ article_ref: articleID });
    if (!assistant) {
      // Manejar el caso en el que no se encuentre el Assistant
      return res.status(404).json({ message: "El Assistant no ha sido creado." });
    }
    // Obtener el Assistant
    res.json({ assistant });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el Assistant",
      error: error.message,
    });
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

//Obtener final_eval en base a generalOpinion
const getFinalEval = (generalOpinion) => {
  return new Promise((resolve, reject) => {
    assistant
      .getFinalEval(generalOpinion)
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
