import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
} from "@mui/material";

const ArticleCard = ({ article }) => {
  const [isHovered, setIsHovered] = useState(false);

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
        <Typography variant="h6" gutterBottom>
          {article.title}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Publicado el {article.date}
        </Typography>
        <Typography variant="body1" paragraph>
          {article.abstract}
        </Typography>
      </CardContent>
      <CardActions>
        <Link href={`/article/${article.id}`}>
          <Button size="small" color="primary">
            Ver más
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default ArticleCard;
