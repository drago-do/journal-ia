import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
} from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import axios from "axios";

import { categoriesUnsplash } from "@/util/unsplashCategory";

const UnsplashKey = process.env.UNSPLASH_KEY;

const ArticleCard = ({ article }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [articleImage, setArticleImage] = useState();

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

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Card
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        position: "relative",
        transition: "box-shadow 0.3s",
        boxShadow: isHovered
          ? "0 0 10px rgba(0, 0, 0, 0.3)"
          : "0 0 5px rgba(0, 0, 0, 0.2)",
      }}
    >
      <CardContent>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <Typography variant="h6" sx={{ maxHeight: "90px", overflow:"hidden", textOverflow: "ellipsis" }}>
              {article && article.title}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Publicado el {formatDate(article.created_at)}
            </Typography>
          </div>
          <CardMedia
            component="img"
            sx={{
              width: 150,
              height: 150,
              display: { xs: "none", sm: "block" },
              padding: "5px",
            }}
            src={articleImage}
            alt={article.title}
          />
        </div>
      </CardContent>
      <CardActions>
        <Link href={`/article/${article._id}`}>
          <Button size="small" color="primary">
            Ver más
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", options);
}

function replaceSpacesWithUnderscores(str) {
  return str.replace(/ /g, "_");
}

export default ArticleCard;
