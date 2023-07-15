import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useState, useEffect } from "react";

export default function AddressForm({ updateMetadata }) {
  const [articleTitle, setArticleTitle] = useState(null);
  const [category, setCategory] = useState("Sistemas Computacionales");
  const [articleAbstract, setArticleAbstract] = useState(null);

  useEffect(() => {
    updateMetadata({
      title: articleTitle,
      category: category,
      abstract: articleAbstract,
    });
  }, [articleTitle, category, articleAbstract, updateMetadata]);

  const handleTitleChange = (event) => {
    setArticleTitle(event.target.value);
  };
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };
  const handleResumenChange = (event) => {
    setArticleAbstract(event.target.value);
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Escríbenos los datos de tu articulo
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="title"
            name="title"
            label="Titulo del articulo"
            fullWidth
            autoComplete="given-name"
            variant="standard"
            onChange={handleTitleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <InputLabel id="demo-simple-select-helper-label">
            Categoría o Materia
          </InputLabel>
          <Select
            labelId="category"
            id="category"
            value={category}
            label="Categoría"
            onChange={handleCategoryChange}
            fullWidth
          >
            <MenuItem value="Ingeniería Civil">Ingeniería Civil</MenuItem>
            <MenuItem value="Ciencias en Alimentos">
              Ciencias en Alimentos
            </MenuItem>
            <MenuItem value="Administración">Administración</MenuItem>
            <MenuItem value="Logística">Logística</MenuItem>
            <MenuItem value="Turismo">Turismo</MenuItem>
            <MenuItem value="Industria 4.0">Industria 4.0</MenuItem>
            <MenuItem value="Investigación Educativa">
              Investigación Educativa
            </MenuItem>
            <MenuItem value="Ciencias Básicas">Ciencias Básicas</MenuItem>
            <MenuItem value="Sistemas Computacionales">
              Sistemas Computacionales
            </MenuItem>
            <MenuItem value="Mecatronica">Mecatrónica</MenuItem>
            <MenuItem value="Electromecánica">Electromecánica</MenuItem>
            <MenuItem value="Gestión Empresarial">Gestión Empresarial</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="abstract"
            label="Abstract o Resumen"
            multiline
            rows={8}
            onChange={handleResumenChange}
            fullWidth
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
