const axios = require("axios");

const APIkey = process.env.API_GPT_KEY;

const abstract_opinion = {
  message: [
    {
      role: "system",
      content:
        "Tu eres un experto en revision de artículos científicos de una reconocida universidad.",
    },
    {
      role: "user",
      content:
        "Hola, necesito ayuda para revisar el siguiente resumen sobre un articulo científico.",
    },
    {
      role: "system",
      content:
        "Claro, soy un experimentado revisor de artículos, encuentro errores de ortografía y coherencia; ademas de dar una opinion clara y concisa sobre diversos temas.",
    },
  ],
};

const questionTheme = {
  role: "user",
  content:
    "Si tuvieras que definir a que area corresponde el resumen de entre Ingeniería Civil, Ciencias en Alimento, Administración, Logística, Turismo, Industria 4.0, Investigación Educativa, Ciencias Básicas, Sistemas Computacionales, Mecatronica, Electromecánica, Gestión Empresaria ¿Que area escogerías? (responde solo con el nombre del area)",
};

const general_opinion = {
  message: [
    {
      role: "system",
      content:
        "Tu eres un experto en revision de artículos científicos de una reconocida universidad.",
    },
    {
      role: "user",
      content:
        "Hola, necesito ayuda para revisar el siguiente articulo científico.",
    },
    {
      role: "system",
      content:
        "Claro, soy un experimentado revisor de artículos, encuentro errores de ortografía y coherencia; ademas de dar una opinion clara y concisa sobre diversos temas. Estas a punto de ver mi lado mas critico en redacción e interpretación de textos, ademas te haré aportaciones o sugerencias para mejorar tu articulo",
    },
  ],
};
const specific_opinion = {
  message: [
    {
      role: "system",
      content:
        "Tu eres un experto en revision de artículos científicos de una reconocida universidad.",
    },
    {
      role: "user",
      content:
        "Hola, necesito ayuda para revisar el siguiente articulo científico.",
    },
    {
      role: "system",
      content:
        "Claro, soy un experimentado revisor de artículos, encuentro errores de ortografía y coherencia; ademas de dar una opinion clara y concisa sobre diversos temas. Estas a punto de ver mi lado mas critico en redacción e interpretación de textos, ademas te haré aportaciones o sugerencias para mejorar tu articulo",
    },
    {
      role: "user",
      content:
        "Bien, te pasare pagina por pagina el articulo para que realices una revision a detalle.",
    },
    {
      role: "system",
      content:
        "Claro, Como revisor de artículos científicos, mi objetivo principal sería evaluar la calidad y la validez del trabajo presentado. Estas son las áreas clave que revisaré y validaré: 1.- Metodología y diseño de investigación: Evaluaría si el estudio está diseñado de manera apropiada para responder a la pregunta de investigación planteada. Revisaría la elección de métodos, el tamaño de la muestra, el enfoque estadístico y otros aspectos relacionados. 2.- Relevancia e originalidad: Determinaría si el artículo aborda una pregunta de investigación relevante y si aporta nuevos conocimientos o enfoques originales al campo científico. Esto implica revisar la literatura existente y evaluar cómo el trabajo se sitúa dentro del contexto actual. 3.- Resultados y análisis: Revisaría los resultados presentados y evaluaría si son sólidos y respaldados por los datos recopilados. Comprobaría si el análisis estadístico utilizado es apropiado y si se han considerado posibles sesgos o limitaciones en la interpretación de los resultados. 4.- Conclusiones y discusión: Evaluaría si las conclusiones del estudio son respaldadas por los resultados presentados. Revisaría la discusión para verificar si los autores interpretan adecuadamente los hallazgos y si se discuten las implicaciones y limitaciones del estudio. 5.- Calidad de la presentación: Revisaría el artículo en términos de claridad, estructura y coherencia. Verificaría si los autores proporcionan suficientes detalles y referencias para que otros investigadores puedan replicar el estudio. 6.-Ética e integridad científica: Sería diligente en detectar posibles problemas de ética en la investigación, como el uso inapropiado de datos, plagio o falta de divulgación de conflictos de interés. 7.-Formato y cumplimiento de las pautas: Aseguraría que el artículo cumpla con las pautas y requisitos establecidos por la revista científica en la que se pretende publicar. Esto incluiría aspectos como la estructura del artículo, la referencia bibliográfica y el uso adecuado de citas.  Claro esta que hare estas revisiones conforme al texto dado.",
    },
  ],
};
const final_eval = { role: "user", content: "message" };

export const getAbstractOpinion = (abstract) => {
  let abstractOpinion;
  let themeOpinion;
  //Añadir el abstract a evaluar
  const mensajeNuevo = {
    role: "user",
    content:
      "¿Me ayudas a revisar el siguiente resumen? Céntrate en revisar errores: Si contiene texto innecesario que desvía la atención del lector, si las oraciones son muy largas o difíciles de entender. O si existe alguna clase de plagio en la lectura. . (Responde solo con los errores encontrados en la revision realizada. Se muy critico.): " +
      abstract,
  };
  abstract_opinion.message.push(mensajeNuevo);
  return new Promise((resolve, reject) => {
    axios
      .post(
        "https://api.openai.com/v1/chat/completions",
        {
          // model: "gpt-3.5-turbo",
          model: "gpt-4",
          messages: abstract_opinion.message,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${APIkey}`,
          },
        }
      )
      .then((response) => {
        abstractOpinion = response.data.choices[0].message.content;
        abstract_opinion.message.push(questionTheme);
        axios
          .post(
            "https://api.openai.com/v1/chat/completions",
            {
              model: "gpt-3.5-turbo",
              messages: abstract_opinion.message,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${APIkey}`,
              },
            }
          )
          .then((response) => {
            themeOpinion = response.data.choices[0].message.content;
            return resolve([abstractOpinion, themeOpinion]);
          });
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

export const getGeneralOpinion = (transcript) => {
  //TODO  Aun no tengo acceso a gpt-4-32k por lo que hay que usar el normal, que admite menos de 5 mil palabras.
  let generalOpinion;
  const [firstHalf, secondHalf] = splitString(transcript);
  //Añadir el abstract a evaluar
  const mensajeNuevo = {
    role: "user",
    content:
      "El articulo es el siguiente (Responde solo con los errores encontrados en la revision realizada. Se muy critico.): " +
      firstHalf,
  };
  general_opinion.message.push(mensajeNuevo);
  return new Promise((resolve, reject) => {
    axios
      .post(
        "https://api.openai.com/v1/chat/completions",
        {
          // model: "gpt-3.5-turbo",
          // model: "gpt-4-32k-0314",
          model: "gpt-4",
          messages: general_opinion.message,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${APIkey}`,
          },
        }
      )
      .then((response) => {
        generalOpinion = response.data.choices[0].message.content;
        resolve(generalOpinion);
      })
      .catch((error) => {
        // console.log(error);
        reject(error);
      });
  });
};

export const getPerPageOpinion = async (transcript) => {
  let perPageOpinion = [];
  const wordCountPerPage = 200;
  const pages = splitStringByWordCount(transcript, wordCountPerPage);

  try {
    //TODO Cambiar el bucle para que sea page.length  (limitado para no gastar tanto)
    for (let i = 0; i < 2; i++) {
      const page = pages[i];
      const mensajeNuevo = {
        role: "user",
        content: `Esta es la página ${
          i + 1
        } (Responde solo con los errores encontrados en la revisión realizada. Sé muy crítico.): ${page}`,
      };
      specific_opinion.message.push(mensajeNuevo);

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: specific_opinion.message,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${APIkey}`,
          },
        }
      );

      const opinionPageGPT = response.data.choices[0].message.content;
      const newOpinion = {
        role: "system",
        content: opinionPageGPT,
      };
      specific_opinion.message.push(newOpinion);
      perPageOpinion.push([page, opinionPageGPT]);
    }

    return perPageOpinion;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

function splitString(str) {
  const middleIndex = Math.floor(str.length / 2);
  const firstHalf = str.slice(0, middleIndex);
  const secondHalf = str.slice(middleIndex);
  return [firstHalf, secondHalf];
}

function splitStringByWordCount(str, wordCount) {
  const words = str.split(" ");
  const chunks = [];
  let currentChunk = "";

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    currentChunk += word + " ";

    if ((i + 1) % wordCount === 0 || i === words.length - 1) {
      chunks.push(currentChunk.trim());
      currentChunk = "";
    }
  }

  return chunks;
}
