import React, { useState, useEffect } from "react";
import Image from "next/image";
import Button from "@mui/material/Button";

export default function GenerarGPT({ objetoAGenerar }) {
  const [title, setTitle] = useState(null);
  const [action, setAction] = useState(null);

  const getTitle = (input) => {
    let title = "";
    switch (input) {
      case "transcript_pdf":
        title = "Transcripción PDF";
        setAction(1);
        break;
      case "abstract_opinion":
        title = "Opinión del Abstract";
        setAction(2);
        break;
      case "category_opinion":
        title = "Opinión de la Categoría";
        setAction(3);
        break;
      case "general_opinion":
        title = "Opinión General";
        setAction(4);
        break;
      case "specific_opinion":
        title = "Opinión Específica";
        setAction(5);
        break;
      case "final_eval":
        title = "Evaluación Final";
        setAction(6);
        break;
      default:
        title = null;
    }
    return title;
  };

  useEffect(() => {
    setTitle(getTitle(objetoAGenerar));
  }, [objetoAGenerar]);

  return (
    <div className="flex-col w-full align-middle">
      <h3
        className="font-sans text-lg font-semibold mt-6"
        style={{ color: "var( --text-green-bg)" }}
      >
        Parece que aun no se a generado {title} por parte de GPT.
      </h3>
      <div className="flex justify-around">
        <Image
          src={"/assets/gptGenerate.png"}
          alt="AyudaGPT"
          width={200}
          height={200}
          className="shadowToPngImage"
        />
        {title && <Button variant="outlined">Generar {title}</Button>}
      </div>
    </div>
  );
}
