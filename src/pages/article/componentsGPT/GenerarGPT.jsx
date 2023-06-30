import React, { useState, useEffect } from "react";
import Image from "next/image";
import Button from "@mui/material/Button";
import Loader from "./Loader";
import axios from "axios";

const url_api = process.env.API_URL;

export default function GenerarGPT({ objetoAGenerar, articleID }) {
  const [title, setTitle] = useState(null);
  const [action, setAction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getTitle = (input) => {
    let title = "";
    switch (input) {
      case "transcript_pdf":
        title = "Transcripción PDF";
        setAction("assistant/create-transcript/");
        break;
      case "abstract_opinion":
        title = "Opinión del Abstract";
        setAction("assistant/abstractAndTheme/");
        break;
      case "category_opinion":
        title = "Opinión de la Categoría";
        setAction("assistant/abstractAndTheme/");
        break;
      case "general_opinion":
        title = "Opinión General";
        setAction("assistant/generalOpinion/");
        break;
      case "specific_opinion":
        title = "Opinión Específica";
        setAction("assistant/opinionPerPage/");
        break;
      case "final_eval":
        title = "Evaluación Final";
        setAction("assistant/finalEval/");
        break;
      default:
        title = null;
    }
    return title;
  };

  const generateGPTAction = () => {
    if (action && objetoAGenerar === "transcript_pdf" && articleID) {
      axios
        .post(`${url_api}/${action}${articleID}`)
        .then((response) => {
          //Recargar pagina
          window.location.reload();
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    } else if (action && articleID) {
      axios
        .put(`${url_api}/${action}${articleID}`)
        .then((response) => {
          //Recargar pagina
          window.location.reload();
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    } else {
      console.error("Hubo un error al realizar la acción");
    }
  };

  useEffect(() => {
    setTitle(getTitle(objetoAGenerar));
  }, [objetoAGenerar]);

  const handleButtonGenerate = () => {
    setIsLoading(true);
    generateGPTAction();
  };

  return (
    <div className="flex-col w-full align-middle">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {" "}
          <h3
            className="font-sans text-lg font-semibold mt-6"
            style={{ color: "var( --text-green-bg)" }}
          >
            Parece que aun no se a generado {title} por parte de GPT.
          </h3>
          <div className="flex justify-around max-h-55">
            <Image
              src={"/assets/gptGenerate.png"}
              alt="AyudaGPT"
              width={200}
              height={200}
              className="shadowToPngImage"
              priority
              style={{ width: "auto", height: "auto" }}
            />
            {title && (
              <Button variant="outlined" onClick={handleButtonGenerate}>
                Generar {title}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
