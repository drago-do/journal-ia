import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import axios from "axios";

const url_api = process.env.API_URL;

export default function ChangeStatusArticle({ idArticle, statusISChanged }) {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    axios
      .get(`${url_api}/article/get_status/${idArticle}`)
      .then((response) => {
        setStatus(response.data[0].status);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [idArticle]);

  const buttons = [
    {
      key: "published",
      label: "Publicar",
      background: "#418944",
      color: "#fff",
    },
    { key: "reject", label: "Rechazar", background: "#D74242", color: "#fff" },
    {
      key: "partial_reject",
      label: "Parcialmente Rechazado",
      background: "#FFAA00",
      color: "#fff",
    },
  ];

  const handleStatusChange = (status) => {
    // Lógica para enviar la actualización a través de Axios a la API
    if (
      !confirm(`¿Estás seguro que quieres cambiar el artículo
    a estado "${status}"?`)
    ) {
      return;
    }
    axios
      .put(`${url_api}/article/change_status/${idArticle}`, {
        status,
      })
      .then((response) => {
        //Reload page
        // window.location.reload();
        statusISChanged(true);
        setStatus(status);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& > *": {
          m: 1,
        },
      }}
    >
      <ButtonGroup size="small" aria-label="small button group">
        {buttons.map((button) => (
          <Button
            className="text-xs p-3"
            key={button.key}
            style={
              button.key === status
                ? { background: button.background, color: button.color }
                : null
            }
            variant={button.key === status ? "contained" : "outlined"}
            onClick={() => handleStatusChange(button.key)}
          >
            {button.label}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
}
