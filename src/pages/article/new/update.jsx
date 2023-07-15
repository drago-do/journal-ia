import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MetadataForm from "./MetadataForm";
import PDFForm from "./PDFForm";
import Header from "./../../components/Header";
import axios from "axios";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";

const steps = ["Metadatos de Articulo", "Subir PDF"];
const API_URL = process.env.API_URL;

function getStepContent(step, articleID, updateMetadata, loading, handleNext) {
  switch (step) {
    case 0:
      return <MetadataForm updateMetadata={updateMetadata} />;
    case 1:
      return (
        <PDFForm
          isLoadingData={loading}
          idArticle={articleID}
          handleNext={handleNext}
        />
      );
    default:
      throw new Error("Unknown step");
  }
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Checkout() {
  const [userID, setUserID] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [articleID, setArticleID] = useState();
  const [metadata, setMetadata] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //Verificar si existe id_user en las cookies, y si el role es igual a author
    const id_user = Cookies.get("id_user");
    const role = Cookies.get("role");
    if (id_user && role == "author") {
      setUserID(id_user);
    } else {
      //Redirigir a la pagina de inicio
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    activeStep == 1 ? uploadMetadata() : null;
  }, [activeStep]);

  const uploadMetadata = () => {
    // Add "author" to metadata
    const author = { author: userID };
    const updatedMetadata = { ...metadata, ...author };
    console.log(API_URL);
    // Upload metadata
    axios
      .post(`${API_URL}/article`, updatedMetadata)
      .then((response) => {
        setArticleID(response.data._id);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateMetadata = (updateData) => {
    setMetadata(updateData);
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Header title={""} sections={[]} />
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography component="h1" variant="h4" align="center">
            Subir nuevo articulo
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography variant="h5" gutterBottom>
                Gracias por tu aportación.
              </Typography>
              <Typography variant="subtitle1">
                Tu articulo sera revisado por expertos en el tema, recibirás
                retroalimentación pronto si este se publica.
              </Typography>
              <Link href={"/"}>
                <Button variant="outlined">Terminar proceso</Button>
              </Link>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {getStepContent(
                activeStep,
                articleID,
                updateMetadata,
                loading,
                handleNext
              )}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {activeStep === steps.length - 1 ? (
                  <></>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 3, ml: 1 }}
                    style={{ background: "#1976D2" }}
                  >
                    Siguiente
                  </Button>
                )}
              </Box>
            </React.Fragment>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
