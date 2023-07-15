const axios = require("axios");
const { encode, decode } = require("gpt-3-encoder");
//antes era de 7800
const maxNumberOfTokens = 7500;

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
        "Claro, Como revisor de artículos científicos, mi objetivo principal sería evaluar la calidad y la validez del trabajo presentado. Estas son las áreas clave que revisaré y validaré: 1.- Metodología y diseño de investigación: Evaluaría si el estudio está diseñado de manera apropiada para responder a la pregunta de investigación planteada. Revisaría la elección de métodos, el tamaño de la muestra, el enfoque estadístico y otros aspectos relacionados. 2.- Relevancia e originalidad: Determinaría si el artículo aborda una pregunta de investigación relevante y si aporta nuevos conocimientos o enfoques originales al campo científico. Esto implica revisar la literatura existente y evaluar cómo el trabajo se sitúa dentro del contexto actual. 3.- Resultados y análisis: Revisaría los resultados presentados y evaluaría si son sólidos y respaldados por los datos recopilados. Comprobaría si el análisis estadístico utilizado es apropiado y si se han considerado posibles sesgos o limitaciones en la interpretación de los resultados. 4.- Conclusiones y discusión: Evaluaría si las conclusiones del estudio son respaldadas por los resultados presentados. Revisaría la discusión para verificar si los autores interpretan adecuadamente los hallazgos y si se discuten las implicaciones y limitaciones del estudio. 5.- Calidad de la presentación: Revisaría el artículo en términos de claridad, estructura y coherencia. Verificaría si los autores proporcionan suficientes detalles y referencias para que otros investigadores puedan replicar el estudio. 6.-Ética e integridad científica: Sería diligente en detectar posibles problemas de ética en la investigación, como el uso inapropiado de datos, plagio o falta de divulgación de conflictos de interés. 7.-Formato y cumplimiento de las pautas: Aseguraría que el artículo cumpla con las pautas y requisitos establecidos por la revista científica en la que se pretende publicar. Esto incluiría aspectos como la estructura del artículo, la referencia bibliográfica y el uso adecuado de citas.  Claro esta que hare estas revisiones conforme al texto dado.",
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
const final_eval = {
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
        "Me complace presentarme como un experto en la revisión de resúmenes de artículos científicos. Con una amplia experiencia en el campo de la ciencia y una profunda comprensión de los estándares académicos, me he convertido en un revisor confiable y riguroso.Como experto, mi objetivo principal es garantizar la calidad y precisión de los resúmenes científicos. La revisión minuciosa de los resúmenes es fundamental para asegurar que la información presentada sea coherente, relevante y esté respaldada por evidencia sólida. Mi enfoque es identificar cualquier error o inexactitud en la estructura, el contenido y el estilo de los resúmenes.Al evaluar los resúmenes, considero varios aspectos clave. Estos incluyen la claridad y coherencia en la presentación de los objetivos de la investigación, la metodología utilizada, los resultados obtenidos y las conclusiones alcanzadas. Además, me aseguro de que los resúmenes sigan las pautas establecidas por la revista científica correspondiente y que cumplan con los estándares éticos y de integridad académica.Mi enfoque no se limita solo a la corrección de errores gramaticales y ortográficos. Mi objetivo es proporcionar una evaluación holística del resumen, destacando las fortalezas y debilidades del trabajo en cuestión. Utilizo un enfoque constructivo y brindo comentarios detallados que ayudan a los autores a mejorar la calidad y la presentación de sus investigaciones.La calificación que otorgo a los resúmenes se basa en un rango de 50 a 100. Esta calificación refleja mi evaluación de la calidad general del resumen en términos de precisión científica, claridad y cumplimiento de las pautas establecidas. Valoro especialmente la originalidad de la investigación, la relevancia de los resultados y la capacidad del resumen para comunicar eficazmente la importancia y el impacto de la investigación realizada.Como experto revisor, me comprometo a proporcionar una revisión imparcial y objetiva. Mi objetivo es ayudar a los investigadores a mejorar sus resúmenes y, en última instancia, contribuir al avance del conocimiento científico.Agradezco la oportunidad de poner mi experiencia al servicio de la comunidad científica y espero colaborar con ustedes en la mejora continua de la calidad de los resúmenes científicos.",
    },
    {
      role: "user",
      content:
        "Bien, te pasare el resumen de los errores de el articulo para que determines si se debe publicar o no, cual es la calificación que le otorgas y el por que.",
    },
  ],
};

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

export const getGeneralOpinion = async (transcript) => {
  let numberOfTokens = getNumberOfTokens(transcript);
  let tokenExcess = numberOfTokens > maxNumberOfTokens ? true : false;
  if (tokenExcess) {
    transcript = await fixStringToMinusTokens(transcript);
  }
  //TODO  Aun no tengo acceso a gpt-4-32k por lo que hay que usar el normal, que admite menos de 5 mil palabras.
  let generalOpinion = tokenExcess
    ? "Parece que no se pudo analizar todo el texto debido a las capacidades del modelo: "
    : "";
  //Añadir el abstract a evaluar
  const mensajeNuevo = {
    role: "user",
    content:
      "El articulo es el siguiente (Responde solo con los errores encontrados en la revision realizada. Se muy critico.): " +
      transcript,
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
        generalOpinion =
          generalOpinion + response.data.choices[0].message.content;
        resolve(generalOpinion);
      })
      .catch((error) => {
        // console.log(error);
        reject(error);
      });
  });
};

export const getFinalEval = (generalOpinion) => {
  //TODO  Aun no tengo acceso a gpt-4-32k por lo que hay que usar el normal, que admite menos de 5 mil palabras.
  let finalEval;
  //Añadir el abstract a evaluar
  const mensajeNuevo = {
    role: "user",
    content:
      "La opinion general de los errores es la siguiente (Responde solo respondiendo estas preguntas: ¿El articulo merece la publicacion?, ¿Que calificación se otorga al articulo ( 50/100)?, ¿Por que esta calificación?.): " +
      generalOpinion,
  };
  final_eval.message.push(mensajeNuevo);
  return new Promise((resolve, reject) => {
    axios
      .post(
        "https://api.openai.com/v1/chat/completions",
        {
          // model: "gpt-3.5-turbo",
          // model: "gpt-4-32k-0314",
          model: "gpt-4",
          messages: final_eval.message,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${APIkey}`,
          },
        }
      )
      .then((response) => {
        finalEval = response.data.choices[0].message.content;
        resolve(finalEval);
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

function countWords(str) {
  // Eliminar espacios en blanco al inicio y al final del string
  str = str.trim();

  // Si el string está vacío, retornar 0
  if (str === "") {
    return 0;
  }

  // Dividir el string en palabras utilizando espacios en blanco y saltos de línea como separadores
  const words = str.split(/\s+|\n/);

  // Retornar la cantidad de palabras
  return words.length;
}

const getNumberOfTokens = (str) => {
  const encoded = encode(str);
  return encoded.length;
};

const fixStringToMinusTokens = (str) => {
  let encoded = encode(str);
  let tokens = encoded.length;
  console.log(`Number of tokens: ${tokens}`);
  if (tokens > maxNumberOfTokens) {
    //Eliminar los últimos 500 caracteres de la cadena
    str = str.substring(0, str.length - 500);
    return fixStringToMinusTokens(str);
  }
  return str;
};
