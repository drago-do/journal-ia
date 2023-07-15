import React from "react";
import { Typography } from "@mui/material";

const TextFormated = ({ text, className }) => {
  // Aplica los estilos CSS según tus necesidades
  const textStyle = {
    whiteSpace: "pre-line", // Permite mantener los saltos de línea
    textAlign: "justify",
    textJustify: "inter-word",
    fontSize: "1.2rem",
  };

  return (
    <div style={textStyle} className={`font-mono ${className}`}>
      {text &&
        text.split("\n").map((paragraph, index) => (
          <React.Fragment key={index}>
            <Typography component={"div"} variant={"body2"}>
              {paragraph + ""}
            </Typography>
            <br />
          </React.Fragment>
        ))}
    </div>
  );
};

export default TextFormated;
