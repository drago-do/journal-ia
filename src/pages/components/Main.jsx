import { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Typography } from "@mui/material";
import ArticleCard from "./ArticleCard";
import FeaturedPost from "./FeaturedPost";

//Definir variable de entorno
const url_api = process.env.API_URL;

const Feed = () => {
  const [articles, setArticles] = useState([]);
  const [firstArticle, setFirstArticle] = useState();

  useEffect(() => {
    // Hacer una llamada a la API para obtener los artículos
    axios.get(url_api + "/article").then((response) => {
      let allArticles = response.data;
      //Eliminar artículos que no tengan el estado "published"
      allArticles = allArticles.filter(
        (article) => article.status === "published"
      );
      setArticles(allArticles);
      setFirstArticle(allArticles[0]); // Establecer el primer artículo como el "firstArticle"
      setArticles((allArticles) => allArticles.slice(1)); // Eliminar el primer artículo de "articles"
    });
  }, []);

  return (
    <div style={{ width: "100%", padding: "40px" }}>
      {firstArticle && <FeaturedPost article={firstArticle} />}
      <Grid container spacing={3}>
        {articles.length > 0 ? (
          articles.map((article, index) => (
            // Renderiza solo los que están públicos
            <Grid item key={index} xs={12} sm={6} md={4}>
              <ArticleCard article={article} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="h6">No hay artículos disponibles.</Typography>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default Feed;
