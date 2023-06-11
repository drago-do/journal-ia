import React from "react";
import { Typography } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";

export default function ArticleCardRevision({
  id,
  title,
  abstract,
  author,
  category,
  status,
  created_at,
}) {
  const [colorStatus, setColorStatus] = useState();

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", options);
  }

  //Redirect to article
  const redirectToArticle = () => {
    window.location.href = `/article/${id}`;
  };

  const getStatus = (status) => {
    let color;

    switch (status) {
      case "wait_revisor":
        color = "#c48300";
        return "Esperando revisión";
      case "wait_admin":
        color = "#c48300";
        return "Esperando aprobación";
      case "published":
        color = "#00c400";
        return "Publicado";
      case "reject":
        color = "#c40000";
        return "Rechazado";
      default:
        color = "transparent";
        return "Error";
    }

    setColorStatus(color);
  };

  return (
    <div
      elevation={3}
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        border: "1px solid #000",
        borderRadius: "5px",
        margin: "10px",
      }}
      onClick={redirectToArticle}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
        }}
      >
        <Typography variant="h6" component="h6">
          {title}
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          {abstract}
        </Typography>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
        }}
      >
        <Typography variant="caption" display="block" gutterBottom>
          {category}
        </Typography>
        <Typography
          variant="caption"
          display="block"
          gutterBottom
          style={{ background: colorStatus, borderRadius: "5px" }}
        >
          {getStatus(status)}
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          {formatDate(created_at)}
        </Typography>
      </div>
    </div>
  );
}
