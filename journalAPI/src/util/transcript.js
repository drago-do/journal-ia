const pdfParse = require("pdf-parse");
const axios = require("axios");
export const getTranscriptPDF = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`http://localhost:3001/pdf/${id}`)
      .then((res) => {
        const pdf = res.data;
        pdfParse(pdf)
          .then((data) => {
            // Aquí, en lugar de devolver la promesa interna,
            // resolvemos la promesa externa con el resultado analizado
            resolve(data);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};
