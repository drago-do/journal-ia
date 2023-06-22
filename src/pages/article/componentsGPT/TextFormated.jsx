import React from "react";

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
          <>
            <p key={index}>{paragraph}</p>
            <br></br>
          </>
        ))}
    </div>
  );
};

export default TextFormated;
