import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import axios from "axios";
import LoadingPencil from "@/pages/components/LoadingPencil";

const API_URL = process.env.API_URL;

export default function PDFForm({ idArticle, isLoadingData, handleNext }) {
  const [loading, setLoading] = useState(isLoadingData);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    setLoading(isLoadingData);
  }, [isLoadingData]);

  const handleLoading = (state) => {
    setLoading(state);
  };

  const handleFileUpload = async (selectedFile) => {
    if (!selectedFile) {
      alert("No se seleccionó ningún archivo");
      handleLoading(false);
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      alert("Solo se puede subir archivos PDF");
      handleLoading(false);
      return;
    }

    if (selectedFile.size > 4.5 * 1024 * 1024) {
      alert("El archivo PDF debe ser menor a 4.5 MB");
      handleLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("pdf", selectedFile);

    try {
      await axios.post(`${API_URL}/pdf/${idArticle}`, formData);
      handleLoading(false);
      // Esperar 400 ms antes de establecer uploadSuccess a true
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUploadSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      handleNext();
    } catch (error) {
      alert("Error al subir el archivo PDF." + error);
    }
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Sube tu archivo pdf
      </Typography>
      <Typography variant="caption" gutterBottom>
        El archivo no debe exceder los 4 MB de espacio en disco para ser
        candidato.
      </Typography>
      <Grid container spacing={3}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            marginTop: "20px",
          }}
        >
          {loading ? (
            <>
              <LoadingPencil />
              <Typography variant="h6" gutterBottom>
                Esperando metadatos...
              </Typography>
            </>
          ) : (
            <PdfUpload
              idArticle={idArticle}
              handleLoading={handleLoading}
              handleFileUpload={handleFileUpload}
              uploadSuccess={uploadSuccess}
              setUploadSuccess={setUploadSuccess}
            />
          )}
        </Box>
      </Grid>
    </React.Fragment>
  );
}

const PdfUpload = ({
  idArticle,
  handleLoading,
  handleFileUpload,
  uploadSuccess,
  setUploadSuccess,
}) => {
  const handleFileChange = (event) => {
    handleFileUpload(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleLoading(true);
  };

  return (
    <div>
      {uploadSuccess ? (
        <div>
          <img
            src="/assets/checked.png"
            alt="Upload Success"
            style={{ width: "50%", height: "50%" }}
          />
          <p>El archivo PDF se ha subido correctamente.</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <label htmlFor="pdf">Subir archivo PDF</label>
          <input
            name="pdf"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ margin: "20px 0 20px" }}
          />
          <button type="submit" id="submitButton">
            <span className="circle1"></span>
            <span className="circle2"></span>
            <span className="circle3"></span>
            <span className="circle4"></span>
            <span className="circle5"></span>
            <span className="text">Subir archivo</span>
          </button>
        </form>
      )}
    </div>
  );
};
