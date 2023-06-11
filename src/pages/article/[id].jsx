import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";

import Header from "./../components/Header";

const url_api = process.env.API_URL;

export default function ArticlePage() {
  const router = useRouter();
  const { id } = router.query; // Accede al valor del parámetro dinámico

  const [article, setArticle] = useState(null);
  useEffect(() => {
    // Obtener artículo
    axios
      .get(`${url_api}/article/${id}`)
      .then((response) => {
        setArticle(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", options);
  }

  return (
    <div>
      <Header title="Vista de Articulo" sections={null} />
      {article && (
        <div>
          <Typography variant="h3" gutterBottom>
            {article.title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {article.abstract}
          </Typography>
          <Typography variant="body2" gutterBottom>
            {article.author}
          </Typography>

          <p>{article.category}</p>
          <p>{article.status}</p>
          <div style={{ display: "flex" }}></div>
          <p>Fecha de creación:{formatDate(article.created_at)}</p>
          <p>Ultima actualización:{formatDate(article.updated_at)}</p>
          {/* Añade el botón de descarga del PDF */}
          <a href={`${url_api}/pdf/article/${id}`} download>
            <Button variant="contained" style={{ background: "#96141c" }}>
              Descargar PDF
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}
