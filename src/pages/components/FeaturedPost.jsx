import * as React from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { useState, useEffect } from "react";
import axios from "axios";

import { categoriesUnsplash } from "@/util/unsplashCategory";

const UnsplashKey = process.env.UNSPLASH_KEY;

function FeaturedPost({ article }) {
  const [articleImage, setArticleImage] = useState();

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", options);
  }

  function replaceSpacesWithUnderscores(str) {
    return str.replace(/ /g, "_");
  }

  useEffect(() => {
    getImageForArticle();
  }, [article]);

  const getImageForArticle = () => {
    if (article) {
      axios
        .get(
          `https://api.unsplash.com/search/photos?query=${replaceSpacesWithUnderscores(
            categoriesUnsplash[article.category]
          )}`,
          {
            headers: {
              Authorization: `Client-ID ${UnsplashKey}`,
            },
          }
        )
        .then((response) => {
          let urlImage;
          try {
            urlImage = response.data.results[0].urls.small;
            setArticleImage(urlImage);
          } catch (error) {
            console.log(error);
            setArticleImage(
              "https://www.jose-aguilar.com/blog/wp-content/uploads/2014/10/Imagen-no-disponible-282x300.png"
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <Grid item xs={12} md={6} mb={2}>
      <CardActionArea component="a" href={`/article/${article._id}`}>
        <Card sx={{ display: "flex" }}>
          <CardContent sx={{ flex: 1 }}>
            <Typography component="h2" variant="h5">
              {article.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {formatDate(article.created_at)}
            </Typography>
            <Typography
              variant="subtitle1"
              paragraph
              sx={{
                maxHeight: "85px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {article.abstract}
            </Typography>
            <Typography variant="subtitle1" color="primary">
              Continuar leyendo
            </Typography>
          </CardContent>
          <CardMedia
            component="img"
            sx={{ width: 160, display: { xs: "none", sm: "block" } }}
            image={articleImage}
            alt={article.category}
          />
        </Card>
      </CardActionArea>
    </Grid>
  );
}

export default FeaturedPost;
