import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextFormated from "./TextFormated";

export default function ViewCategory({ category }) {
  return (
    <div>
      <h3
        className="font-sans text-lg font-semibold mt-6"
        style={{ color: "var( --text-green-bg)" }}
      >
        Opinion sobre el tema o categoría
      </h3>
      <Accordion style={{ background: "var(--strong-green-bg)" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
        >
          <Typography className="font-bold">Ver resumen</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextFormated text={category} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
