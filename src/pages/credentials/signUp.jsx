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
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";

// TODO remove, this demo shouldn't need to reset the theme.
//Definir variable de entorno
const url_api = process.env.API_URL;

const defaultTheme = createTheme();

export default function SignUp() {
  const [passwordIsCorrect, setPasswordIsCorrect] = useState(null);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (event.target.value.length < 5) {
      setPasswordIsCorrect(false);
    } else {
      setPasswordIsCorrect(true);
    }
  };

  const handlePassword2Change = (event) => {
    setPassword2(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    password !== password2
      ? setPasswordIsCorrect(false)
      : setPasswordIsCorrect(null);
    if (passwordIsCorrect) {
      const data = new FormData(event.currentTarget);
      let name = data.get("name");
      let lastName = data.get("lastName");
      let email = data.get("email");
      let password = data.get("password");
      // !Send to api
      axios
        .post(url_api + "/user", {
          name: name,
          lastname: lastName,
          email: email,
          password: password,
        })
        .then((response) => {
          if (response.data._id) {
            //Save response.data in cookies
            Cookies.set("id_user", response.data._id);
            Cookies.set("name", response.data.name);
            Cookies.set("lastname", response.data.lastname);
            Cookies.set("email", response.data.email);
            Cookies.set("role", response.data.role);
            window.location.href = "/";
          } else {
            alert(response.data.msg);
          }
        })
        .catch((error) => {
          console.log(error);
          alert("Error al registrar usuario");
        });
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "var(--primary-bg-color)" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Regístrate
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Nombre(s)"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Apellidos(s)"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Correo Electrónico"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={handlePasswordChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password-2"
                  label="Repite tu contraseña"
                  type="password"
                  id="password-2"
                  onChange={handlePassword2Change}
                />
              </Grid>
            </Grid>
            {passwordIsCorrect === false ? warningAlert() : null}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              style={{ background: "var(--primary-bg-color)" }}
            >
              Registrar
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/credentials/login" variant="body2">
                  Ya tienes cuenta? Inicia sesión
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

const warningAlert = () => {
  return (
    <Alert severity="error" style={{ margin: "10px 0" }}>
      <AlertTitle>
        Las contraseñas no coinciden o son menores a 5 caracteres
      </AlertTitle>
      Por favor, verifica que las contraseñas coincidan.
    </Alert>
  );
};
