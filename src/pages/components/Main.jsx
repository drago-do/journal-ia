import { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Typography } from "@mui/material";
import ArticleCard from "./ArticleCard";

const Feed = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Hacer una llamada a la API para obtener los artículos
    axios.get("/api/articles").then((response) => {
      setArticles(response.data);
    });
  }, []);

  return (
    <Grid container spacing={2}>
      {articles.length > 0 ? (
        articles.map((article) => (
          <Grid item key={article.id} xs={12} sm={6} md={4}>
            <ArticleCard article={article} />
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Typography variant="h6">No hay artículos disponibles.</Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default Feed;
