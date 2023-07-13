import React, { useState, useEffect } from "react";
import axios from "axios";
import ViewTranscript from "./ViewTranscript";
import ViewAbstract from "./ViewAbstract";
import ViewCategory from "./ViewCategoryOpinion";
import ViewGeneralOpinion from "./ViewGeneralOpinion";
import ViewSpecificOpinion from "./ViewSpecificOpinion";
import ViewFinalEval from "./ViewFinalEval";
import GenerarGPT from "./GenerarGPT";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import Image from "next/image";

const url_api = process.env.API_URL;
// const articleID = "64924afafe72da3bda4302ac";

export default function MainGPT({
  articleID,
  handleAssignFunction,
  canGenerateGeneralOpinion,
  handleAdminCanComment,
}) {
  const [dataBaseArticleID, setDataBaseArticleID] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [abstract, setAbstract] = useState(null);
  const [category_opinion, setCategory_opinion] = useState(null);
  const [general_opinion, setGeneral_opinion] = useState(null);
  const [specific_opinion, setSpecific_opinion] = useState(null);
  const [final_eval, setFinal_eval] = useState(null);
  const [componentsRender, setComponentsRender] = useState(0);
  const [listOfComponents, setListOfComponents] = useState(null);

  const [availableGeneralOpinion, setAvailableGeneralOpinion] = useState(false);

  const userCanGenerateGeneralOpinion = (object) => {
    //Verify if "canGenerateGeneralOpinion" is an object
    if (typeof object === "object") {
      //Verify if "canGenerateGeneralOpinion" is not null
      if (object) {
        console.log("Main GPT" + object);
        setAvailableGeneralOpinion(false);
        handleAdminCanComment(false);
      }
    } else {
      setAvailableGeneralOpinion(true);
      handleAdminCanComment(true);
    }
  };
  useEffect(() => {
    canGenerateGeneralOpinion &&
      userCanGenerateGeneralOpinion(canGenerateGeneralOpinion);
  }, [canGenerateGeneralOpinion]);

  useEffect(() => {
    if (articleID) {
      setDataBaseArticleID(articleID);
      axios
        .get(`${url_api}/assistant/${articleID}`)
        .then((response) => {
          const assistantOpinion = response.data.assistant;
          const {
            transcript_pdf,
            abstract_opinion,
            category_opinion,
            general_opinion,
            specific_opinion,
            final_eval,
          } = assistantOpinion;
          setTranscript(transcript_pdf ?? null);
          setAbstract(abstract_opinion ?? null);
          setCategory_opinion(category_opinion ?? null);
          setGeneral_opinion(general_opinion ?? null);
          setSpecific_opinion(specific_opinion ?? null);
          setFinal_eval(final_eval ?? null);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [articleID]);

  useEffect(() => {
    const counter =
      transcript &&
      abstract &&
      category_opinion &&
      general_opinion &&
      specific_opinion.length != 0 &&
      final_eval
        ? 6
        : transcript &&
          abstract &&
          category_opinion &&
          general_opinion &&
          specific_opinion.length != 0
        ? 5
        : transcript && abstract && category_opinion && general_opinion
        ? 4
        : transcript && abstract && category_opinion
        ? 3
        : transcript && abstract
        ? 2
        : transcript
        ? 1
        : 0;

    setComponentsRender(counter);
  }, [
    transcript,
    abstract,
    category_opinion,
    general_opinion,
    specific_opinion,
    final_eval,
  ]);

  useEffect(() => {
    const components = [];

    if (componentsRender >= 1) {
      handleAssignFunction(false);
      components.push({
        component: ViewTranscript,
        propName: "transcript",
        propValue: transcript,
      });
    }

    if (componentsRender >= 2) {
      handleAssignFunction(false);
      components.push({
        component: ViewAbstract,
        propName: "abstract",
        propValue: abstract,
      });
    }

    if (componentsRender >= 3) {
      handleAssignFunction(true);
      components.push({
        component: ViewCategory,
        propName: "category",
        propValue: category_opinion,
      });
    }

    if (componentsRender >= 4) {
      handleAssignFunction(true);
      components.push({
        component: ViewGeneralOpinion,
        propName: "generalOpinion",
        propValue: general_opinion,
      });
    }

    if (componentsRender >= 5) {
      handleAssignFunction(true);
      components.push({
        component: ViewSpecificOpinion,
        propName: "specificOpinion",
        propValue: specific_opinion,
      });
    }

    if (componentsRender >= 6) {
      handleAssignFunction(true);
      components.push({
        component: ViewFinalEval,
        propName: "finalEval",
        propValue: final_eval,
      });
    }
    if (componentsRender === 0 || componentsRender < 6) {
      components.push({
        component: GenerarGPT,
        propName: "objetoAGenerar",
        propValue:
          componentsRender === 0
            ? "transcript_pdf"
            : componentsRender === 1
            ? "abstract_opinion"
            : componentsRender === 2
            ? "category_opinion"
            : componentsRender === 3 && availableGeneralOpinion
            ? "general_opinion"
            : componentsRender === 4
            ? "specific_opinion"
            : componentsRender === 5
            ? "final_eval"
            : null,
        propNameID: "1",
        propValueID: "1",
      });
      if (!availableGeneralOpinion) {
        components.push({
          component: RevisorOpinionsIncomplete,
          propName: "usuarios",
          propValue: canGenerateGeneralOpinion,
        });
      }
    }

    setListOfComponents(components);
  }, [componentsRender]);

  return (
    <div className="container m-3 mx-auto px-4 py-4 bg-clip-border bg-lime-200	rounded-md">
      <h3 className="font-mono text-3xl	antialiased font-bold	rounded-md bg-slate-50 px-3 py-2 inline">
        Revisor GPT{" "}
      </h3>
      {listOfComponents &&
        listOfComponents.map((item, index) => {
          const {
            component: Component,
            propName,
            propValue,
            propNameID,
            propValueID,
          } = item;
          if (propNameID && propValueID) {
            return (
              <Component
                key={index}
                {...{ [propName]: propValue }}
                articleID={dataBaseArticleID}
              />
            );
          } else {
            return <Component key={index} {...{ [propName]: propValue }} />;
          }
        })}
    </div>
  );
}

const RevisorOpinionsIncomplete = ({ usuarios }) => {
  return (
    <>
      {usuarios ? (
        <Alert severity="info" className="mt-5">
          <AlertTitle>
            Falta que los siguientes <strong>usuarios</strong> añadan su
            opinion:
          </AlertTitle>
          {usuarios.map((usuario, index) => {
            return (
              <div
                key={index}
                className="border-solid border-2 border-sky-200 p-2 rounded-md flex flex-row"
              >
                <Image
                  src={"/assets/revisor.png"}
                  alt="imagen revisor"
                  width={40}
                  height={40}
                  className="mr-4"
                />
                <div>
                  <p>{usuario.name + " " + usuario.lastname}</p>
                  <p>{usuario.email}</p>
                </div>
              </div>
            );
          })}
          <p className="italic font-thin	">
            Es necesario que estos realicen sus comentarios antes de que la IA
            analice el texto.
          </p>
        </Alert>
      ) : null}
    </>
  );
};

//!----------------------------------------------------------------------------
