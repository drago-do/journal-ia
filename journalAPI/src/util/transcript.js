const pdfParse = require("pdf-parse");
const http = require("http");
const fs = require("fs");
require("dotenv").config();

export const getTranscriptPDF = (id) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: process.env.API_HOSTNAME, // Actualiza con el nombre de tu variable de entorno
      port: process.env.API_PORT, // Actualiza con el nombre de tu variable de entorno
      path: `/pdf/${id}`,
      method: "GET",
    };

    const req = http.request(options, (res) => {
      if (res.statusCode !== 200) {
        reject(
          new Error(
            `Error al descargar el PDF. Código de estado: ${res.statusCode}`
          )
        );
        return;
      }

      const chunks = [];

      res.on("data", (chunk) => {
        chunks.push(chunk);
      });

      res.on("end", () => {
        const pdf = Buffer.concat(chunks);

        // Generar un nombre de archivo único para el PDF temporal
        const tempFileName = `temp_${Date.now()}.pdf`;
        const tempFilePath = `./${tempFileName}`;

        // Guardar el PDF en la ubicación temporal
        fs.writeFile(tempFilePath, pdf, (err) => {
          if (err) {
            console.error("Error al guardar el PDF temporal:", err);
            reject(err);
          } else {
            // Leer y analizar el PDF desde la ubicación temporal
            pdfParse(tempFilePath)
              .then((data) => {
                //Eliminar el pdf temporal
                fs.unlink(tempFilePath, (err) => {
                  if (err) {
                    console.error("Error al eliminar el PDF temporal:", err);
                  }
                });
                // Aquí, en lugar de devolver la promesa interna,
                // resolvemos la promesa externa con el resultado analizado
                resolve(data);
              })
              .catch((err) => {
                console.error("Error al analizar el PDF:", err);
                reject(err);
              });
          }
        });
      });
    });

    req.on("error", (err) => {
      console.error("Error al descargar el PDF:", err);
      reject(err);
    });

    req.end();
  });
};
