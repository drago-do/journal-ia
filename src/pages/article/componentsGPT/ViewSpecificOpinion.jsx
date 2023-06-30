import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextFormated from "./TextFormated";

export default function ViewSpecificOpinion({ specificOpinion }) {
  return (
    <div>
      <h3
        className="font-sans text-lg font-semibold mt-6"
        style={{ color: "var( --text-green-bg)" }}
      >
        Opinion por pagina
      </h3>
      <Accordion style={{ background: "var(--strong-green-bg)" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
        >
          <Typography className="font-bold">
            Ver la opinion por pagina
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {specificOpinion &&
            specificOpinion.map((page, index) => {
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
                    <Typography component={"div"}>
                      <TextFormated text={page[0]} />
                    </Typography>
                    <Typography component={"div"}>
                      <TextFormated
                        className={"bg-lime-200 rounded-md p-4"}
                        text={page[1]}
                      />
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              );
            })}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
