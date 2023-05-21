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

const general_opinion = { role: "user", content: "" };
const specific_opinion = { role: "user", content: "message" };
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
