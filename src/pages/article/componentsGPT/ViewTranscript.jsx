import React from "react";
import { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function ViewTranscript({ transcript }) {
  const [transcriptPerPage, setTranscriptPerPage] = useState(null);

  const divideTranscriptPerPage = () => {
    const wordsPerPage = 600;
    const words = transcript.split(" ");
    const chunks = [];
    let currentChunk = "";

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      currentChunk += word + " ";

      if ((i + 1) % wordsPerPage === 0 || i === words.length - 1) {
        chunks.push(currentChunk.trim());
        currentChunk = "";
      }
    }
    setTranscriptPerPage(chunks);
  };

  useEffect(() => {
    if (transcript) {
      divideTranscriptPerPage();
    }
  }, [transcript]);


  return (
    <div>
      <h3
        className="font-sans text-lg font-semibold mt-6"
        style={{ color: "var( --text-green-bg)" }}
      >
        Transcripción del Texto
      </h3>
      <Accordion style={{ background: "var(--strong-green-bg)" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
        >
          <Typography className="font-bold">
            Ver la transcripción por pagina
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {transcriptPerPage &&
            transcriptPerPage.map((page, index) => {
              return (
                <Accordion style={{ background: "#ADC77D" }} key={index}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id={`panel${index}-header`}
                  >
                    <Typography className="font-bold">
                      Página {index + 1}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{page}</Typography>
                  </AccordionDetails>
                </Accordion>
              );
            })}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
