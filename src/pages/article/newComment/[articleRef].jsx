import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import AddCommentIcon from "@mui/icons-material/AddComment";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useRouter } from "next/router";
import Header from "@/pages/components/Header";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import axios from "axios";
import Cookies from "js-cookie";
import ChangeStatusArticle from "./ChangeArticleStatus";

const defaultTheme = createTheme();
//Definir variable de entorno
const url_api = process.env.API_URL;

export default function NewCommentPage() {
  const router = useRouter();
  const { articleRef } = router.query;

  const [errorFormText, setErrorFormText] = useState("");
  const [commentSendSuccessful, setCommentSendSuccessful] = useState(false);
  const [statusISChanged, setStatusIsChange] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(Cookies.get("role") === "admin");
  }, []);

  useEffect(() => {
    setStatusIsChange(!isAdmin);
  }, [isAdmin]);

  const handleStatusISChanged = (valor) => {
    setStatusIsChange(valor);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let specific_questions = [];
    specific_questions.push(
      data.get("question1"),
      data.get("question2"),
      data.get("question3"),
      data.get("question4"),
      data.get("question5"),
      data.get("question6"),
      data.get("question7"),
      data.get("question8"),
      data.get("question9"),
      data.get("question10"),
      data.get("question11"),
      data.get("question12")
    );
    let commentToAuthor = data.get("commentToAuthor");
    let commentToAdmin = data.get("commentToAdmin");
    let userName = Cookies.get("name") + " " + Cookies.get("lastname");
    let id_user = Cookies.get("id_user");
    if (
      verifyAllQuestions(specific_questions, commentToAuthor, commentToAdmin) &&
      articleRef
    ) {
      axios
        .post(url_api + "/commentOfRevisor", {
          article_ref: articleRef,
          userName: userName,
          id_user: id_user,
          commentForAuthor: commentToAuthor,
          commentForAdmin: commentToAdmin,
          specific_questions: specific_questions,
        })
        .then((response) => {
          console.log(response);
          //Enviar correo al author sobre su publicación
          axios.post(`${url_api}/article/review/${articleRef}`);
          setCommentSendSuccessful(true);
          setTimeout(() => {
            //Redirigir a la pagina de inicio
            router.push("/");
          }, 5000);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("no");
    }
  };

  const verifyAllQuestions = (
    specific_questions,
    commentToAuthor,
    commentForAdmin
  ) => {
    let errorText = "";
    //Recorre el array de specific_questions, rescata en otro array las posiciones cuyo valor sea null
    if (isAdmin) {
      //Si el comentario al administrador está vacío, entonces se agrega al errorText
      if (commentToAuthor == "") {
        errorText += ", Debes agregar un comentario al administrador.";
      }
      if (!statusISChanged) {
        errorText +=
          " Debes cambiar el estado del artículo. (publicar, rechazar o dar otra oportunidad.)";
      }
    } else {
      let nullQuestions = [];
      for (let i = 0; i < specific_questions.length; i++) {
        if (specific_questions[i] == null) {
          nullQuestions.push(i + 1);
        }
      }
      //Si el array de posiciones con valor null es mayor a 0, entonces hay preguntas sin responder
      if (nullQuestions.length > 0) {
        errorText =
          "Debes responder todas las preguntas, los números de las preguntas sin responder son: ";
        for (let i = 0; i < nullQuestions.length; i++) {
          errorText += nullQuestions[i] + ", ";
        }
      }
      //Si el comentario al autor está vacío, entonces se agrega al errorText
      if (commentToAuthor == "") {
        errorText += "Debes agregar un comentario al autor";
      }
      //Si el comentario al administrador está vacío, entonces se agrega al errorText
      if (commentForAdmin == "") {
        errorText += ", Debes agregar un comentario al administrador.";
      }
    }
    if (errorText != "") {
      //Si el errorText no está vacío, entonces se muestra el error
      setErrorFormText(errorText);
      return false;
    } else {
      return true;
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Header title="" />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <AddCommentIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Crear comentario de revision
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            {!isAdmin && (
              <Grid container spacing={2}>
                <Grid item sm={12}>
                  <FormLabel id="question1-label">
                    1. ¿Está el tema del artículo dentro del alcance de la
                    revista?
                  </FormLabel>
                  <RadioGroup
                    row
                    name="question1"
                    required
                    onChange={() => setErrorFormText("")}
                  >
                    <FormControlLabel
                      value="si"
                      control={<Radio />}
                      label="Si"
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </Grid>
                <Grid item sm={12}>
                  <FormLabel id="question2-label">
                    2. ¿Es esta una contribución original y relevante?
                  </FormLabel>
                  <RadioGroup
                    row
                    name="question2"
                    required
                    onChange={() => setErrorFormText("")}
                  >
                    <FormControlLabel
                      value="si"
                      control={<Radio />}
                      label="Si"
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </Grid>
                <Grid item sm={12}>
                  <FormLabel id="question3-label">
                    3. Los objetivos e hipótesis (en los casos que aplique)
                    están claramente expuestos
                  </FormLabel>
                  <RadioGroup
                    row
                    name="question3"
                    required
                    onChange={() => setErrorFormText("")}
                  >
                    <FormControlLabel
                      value="si"
                      control={<Radio />}
                      label="Si"
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                    />
                    <FormControlLabel
                      value="n/a"
                      control={<Radio />}
                      label="N/A"
                    />
                  </RadioGroup>
                </Grid>
                <Grid item sm={12}>
                  <FormLabel id="question4-label">
                    4. La metodología está bien indicada y es congruente con los
                    objetivos
                  </FormLabel>
                  <RadioGroup
                    row
                    name="question4"
                    required
                    onChange={() => setErrorFormText("")}
                  >
                    <FormControlLabel
                      value="si"
                      control={<Radio />}
                      label="Si"
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </Grid>
                <Grid item sm={12}>
                  <FormLabel id="question5-label">
                    5. ¿Son las figuras y tablas necesarias y aceptables?
                  </FormLabel>
                  <RadioGroup
                    row
                    name="question5"
                    required
                    onChange={() => setErrorFormText("")}
                  >
                    <FormControlLabel
                      value="si"
                      control={<Radio />}
                      label="Si"
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                    />
                    <FormControlLabel
                      value="ver comentarios"
                      control={<Radio />}
                      label="Ver comentarios"
                    />
                  </RadioGroup>
                </Grid>
                <Grid item sm={12}>
                  <FormLabel id="question6-label">
                    6. Los resultados presentados provienen de datos analizados
                    mediante métodos estadísticos pertinentes{" "}
                  </FormLabel>
                  <RadioGroup
                    row
                    name="question6"
                    required
                    onChange={() => setErrorFormText("")}
                  >
                    <FormControlLabel
                      value="si"
                      control={<Radio />}
                      label="Si"
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </Grid>
                <Grid item sm={12}>
                  <FormLabel id="question7-label">
                    7. ¿Las interpretaciones / conclusiones son sólidas y están
                    justificadas por los resultados?
                  </FormLabel>
                  <RadioGroup
                    row
                    name="question7"
                    required
                    onChange={() => setErrorFormText("")}
                  >
                    <FormControlLabel
                      value="si"
                      control={<Radio />}
                      label="Si"
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </Grid>
                <Grid item sm={12}>
                  <FormLabel id="question8-label">
                    8. ¿Es satisfactoria la organización y extensión del
                    manuscrito?
                  </FormLabel>
                  <RadioGroup
                    row
                    name="question8"
                    required
                    onChange={() => setErrorFormText("")}
                  >
                    <FormControlLabel
                      value="si"
                      control={<Radio />}
                      label="Si"
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </Grid>
                <Grid item sm={12}>
                  <FormLabel id="question9-label">
                    9. ¿Es satisfactorio el uso del lenguaje?{" "}
                  </FormLabel>
                  <RadioGroup
                    row
                    name="question9"
                    required
                    onChange={() => setErrorFormText("")}
                  >
                    <FormControlLabel
                      value="si"
                      control={<Radio />}
                      label="Si"
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                    />
                    <FormControlLabel
                      value="ver comentarios"
                      control={<Radio />}
                      label="Ver comentarios"
                    />
                  </RadioGroup>
                </Grid>
                <Grid item sm={12}>
                  <FormLabel id="question10-label">
                    10. ¿Son suficientes y actualizadas las referencias?
                  </FormLabel>
                  <RadioGroup
                    row
                    name="question10"
                    required
                    onChange={() => setErrorFormText("")}
                  >
                    <FormControlLabel
                      value="si"
                      control={<Radio />}
                      label="Si"
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                    />
                    <FormControlLabel
                      value="ver comentarios"
                      control={<Radio />}
                      label="Ver comentarios"
                    />
                  </RadioGroup>
                </Grid>
                <Grid item sm={12}>
                  <FormLabel id="question11-label">
                    11. La calidad científica del artículo es:
                  </FormLabel>
                  <RadioGroup
                    row
                    name="question11"
                    required
                    onChange={() => setErrorFormText("")}
                  >
                    <FormControlLabel
                      value="Elevado"
                      control={<Radio />}
                      label="Elevado"
                    />
                    <FormControlLabel
                      value="Promedio"
                      control={<Radio />}
                      label="Promedio"
                    />
                    <FormControlLabel
                      value="Pobre"
                      control={<Radio />}
                      label="Pobre"
                    />
                  </RadioGroup>
                </Grid>
                <Grid item sm={12}>
                  <FormLabel id="question12-label">
                    12. Recomendaciones del revisor
                  </FormLabel>
                  <RadioGroup
                    name="question12"
                    required
                    onChange={() => setErrorFormText("")}
                  >
                    <FormControlLabel
                      value="Aceptar"
                      control={<Radio />}
                      label="Aceptar"
                    />
                    <FormControlLabel
                      value="Rechazar"
                      control={<Radio />}
                      label="Rechazar"
                    />
                    <FormControlLabel
                      value="Aceptado con correcciones mayores"
                      control={<Radio />}
                      label="Aceptado con correcciones mayores"
                    />
                    <FormControlLabel
                      value="Aceptado con correcciones menores"
                      control={<Radio />}
                      label="Aceptado con correcciones menores"
                    />
                    <FormControlLabel
                      value="No se encuentra dentro del área de la revista"
                      control={<Radio />}
                      label="No se encuentra dentro del área de la revista"
                    />
                  </RadioGroup>
                </Grid>

                <Grid item xs={12} mt={2}>
                  <Typography variant="h5" component="h5">
                    Comentarios finales
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    id="commentToAdmin"
                    name="commentToAdmin"
                    label="Comentario para el administrador"
                    placeholder="Coloca tu comentario"
                    multiline
                    fullWidth
                    onBlur={() => setErrorFormText("")}
                  />
                </Grid>
              </Grid>
            )}

            <Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="commentToAuthor"
                  name="commentToAuthor"
                  label="Comentario para el autor"
                  placeholder="Coloca tu comentario"
                  multiline
                  fullWidth
                  onBlur={() => setErrorFormText("")}
                />
              </Grid>
            </Grid>

            {errorFormText != "" && (
              <Stack sx={{ width: "100%", mt: 2 }} spacing={2}>
                <Alert severity="error">
                  <AlertTitle>Tienes que llenar todos los campos</AlertTitle>
                  Parece que aun hay preguntas o comentarios que no respondes,
                  revíselos. — <strong>{errorFormText} </strong>
                </Alert>
              </Stack>
            )}

            {commentSendSuccessful && (
              <Stack sx={{ width: "100%", mt: 2, mb: 20 }} spacing={2}>
                <Alert severity="success">
                  <AlertTitle>Comentarios enviados correctamente</AlertTitle>
                  Serás redirigido a la pagina principal.
                </Alert>
              </Stack>
            )}
            {isAdmin && (
              <ChangeStatusArticle
                idArticle={articleRef}
                statusISChanged={handleStatusISChanged}
              />
            )}
            {articleRef && commentSendSuccessful === false && (
              <Button
                type="submit"
                fullWidth
                variant="outlined"
                sx={{ mt: 5, mb: 12 }}
              >
                Enviar comentario
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
