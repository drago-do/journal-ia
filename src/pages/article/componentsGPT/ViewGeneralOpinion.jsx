import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextFormated from "./TextFormated";

export default function ViewGeneralOpinion({ generalOpinion }) {
  return (
    <div>
      <h3
        className="font-sans text-lg font-semibold mt-6"
        style={{ color: "var( --text-green-bg)" }}
      >
        Opinion general
      </h3>
      <Accordion style={{ background: "var(--strong-green-bg)" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
        >
          <Typography className="font-bold">Ver resumen</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextFormated text={generalOpinion} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
