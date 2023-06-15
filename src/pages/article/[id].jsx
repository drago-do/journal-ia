import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import * as React from "react";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";

import Header from "./../components/Header";
import Cookies from "js-cookie";

const url_api = process.env.API_URL;

const infoStyle = {
  marginLeft: "5px",
  padding: "0 20px",
  borderRadius: "5px",
};

export default function ArticlePage() {
  const router = useRouter();
  const { id } = router.query; // Accede al valor del parámetro dinámico

  const [article, setArticle] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [canComment, setCanComment] = useState(false);
  const [canViewStatus, setCanViewStatus] = useState(false);
  const [authorName, setAuthorName] = useState("");

  useEffect(() => {
    // Obtener artículo
    axios
      .get(`${url_api}/article/${id}`)
      .then((response) => {
        setArticle(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    setAdmin(Cookies.get("role") === "admin" ? true : false);
    thisUserCanComment();
    thisUserCanViewStatusArticle();
  }, [id]);

  useEffect(() => {
    article && getNameOfAuthor(article.author);
  }, [article]);

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", options);
  }

  const thisUserCanViewStatusArticle = () => {
    const role = Cookies.get("role");
    role && setCanViewStatus(role !== "user");
  };

  const thisUserCanComment = () => {
    const role = Cookies.get("role");
    if (role === "revisor") {
      //Hacer consulta a la api con el id del usuario para rescatar el campo assignArticles
      //Si el campo assignArticles contiene el id del artículo, entonces puede comentar
      axios
        .get(`${url_api}/user/${Cookies.get("id_user")}`)
        .then((response) => {
          console.log(response.data);
          console.log(response.data.assignArticles.includes(id));
          if (response.data.assignArticles.includes(id)) {
            setCanComment(true);
            return true;
          }
          return false;
        });
    }
    if (role === "admin") return true;
    return false;
  };

  function getCategoryColor(category) {
    switch (category) {
      case "Ingeniería Civil":
        return "bg-blue-500 text-white";
      case "Ciencias en Alimentos":
        return "bg-green-500 text-white";
      case "Administración":
        return "bg-red-500 text-white";
      case "Logística":
        return "bg-purple-500 text-white";
      case "Turismo":
        return "bg-yellow-500 text-black";
      case "Industria 4.0":
        return "bg-teal-500 text-white";
      case "Investigación Educativa":
        return "bg-pink-500 text-white";
      case "Ciencias Básicas":
        return "bg-indigo-500 text-white";
      case "Sistemas Computacionales":
        return "bg-orange-500 text-white";
      case "Mecatronica":
        return "bg-cyan-500 text-white";
      case "Electromecánica":
        return "bg-lime-500 text-black";
      case "Gestión Empresarial":
        return "bg-gray-500 text-white";
      default:
        return "";
    }
  }

  function getStatusColor(status) {
    switch (status) {
      case "wait_revisor":
        return "bg-yellow-500 text-black";
      case "published":
        return "bg-green-500 text-withe";
      case "reject":
        return "bg-red-500 text-white";
      // Agrega más casos según tus estados y colores deseados
      default:
        return "";
    }
  }

  function getNameOfAuthor(idAuthor) {
    axios
      .get(`${url_api}/user/${idAuthor}`)
      .then((response) => {
        console.log(response);
        setAuthorName(response.data.name + " " + response.data.lastname);
      })
      .catch(() => alert("Error al obtener el nombre del autor"));
  }

  const VisualArticleInfo = () => {
    return (
      <div
        style={{
          width: "95%",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <p style={infoStyle} className={getCategoryColor(article.category)}>
          {article.category}
        </p>
        <div>
          Escrito por:{" "}
          <span
            style={{
              marginLeft: "5px",
              padding: "0 20px",
              background: "#808080",
              color: "#fff",
              borderRadius: "5px",
            }}
          >
            {authorName}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Header title="Vista de Articulo" />
      {article && (
        <div style={{ width: "100%", padding: "30px" }}>
          <Typography variant="h4" gutterBottom>
            {article.title}
          </Typography>
          <VisualArticleInfo />

          <Typography variant="body1" gutterBottom>
            {article.abstract}
          </Typography>

          {canViewStatus && (
            <Typography
              variant="caption"
              style={infoStyle}
              className={getStatusColor(article.status) + "rounded"}
            >
              {article.status}
            </Typography>
          )}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p>
              Fecha de creación:
              <span
                style={infoStyle}
                className="text-white rounded bg-slate-600"
              >
                {formatDate(article.created_at)}{" "}
              </span>
            </p>
            <p>
              Ultima actualización:
              <span
                style={infoStyle}
                className="text-white rounded bg-slate-600"
              >
                {formatDate(article.updated_at)}
              </span>
            </p>
          </div>
          <div
            style={{
              marginTop: "20px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <a href={`${url_api}/pdf/article/${id}`} download>
              <Button
                variant="contained"
                fullWidth
                style={{ background: "#96141c" }}
              >
                Descargar PDF
              </Button>
            </a>
          </div>
          <br />
          <br />
          <br />
          {admin && (
            <ChangeStatusArticle
              actualStatus={article.status}
              idArticle={article._id}
            />
          )}
          <CommentsOfArticle article={article} />
          {canComment && <AddComment article={article} />}
          {/* Añade el botón de descarga del PDF */}
        </div>
      )}
    </div>
  );
}

const CommentsOfArticle = ({ article }) => {
  const [comments, setComments] = useState(null);
  useEffect(() => {
    // Obtener comentarios del artículo
    setComments(article.comments);
  }, [article]);

  return (
    <div>
      {comments &&
        comments.map((comment, index) => {
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 mb-4 flex"
            >
              <img
                src="/assets/revisor.png"
                alt="revisor"
                style={{ maxHeight: "50px", marginRight: "30px" }}
              />
              <div>
                <p className="text-gray-700">{comment.comments}</p>
                <p className="text-gray-500">{comment.name}</p>
              </div>
            </div>
          );
        })}
    </div>
  );
};

const AddComment = ({ article }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const idUser = Cookies.get("id_user");
    const comments = comment;
    // Enviar comentario
    axios
      .put(`${url_api}/article/add_comment/${article._id}`, {
        idUser,
        comments,
      })
      .then((response) => {
        console.log(response.data);
        setComment("");
        //Reload page
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Agregar Comentario</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-4 rounded-lg shadow-md mb-4"
          rows={4}
          placeholder="Escribe tu comentario..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          type="submit"
        >
          Enviar Comentario
        </button>
      </form>
    </div>
  );
};

const ChangeStatusArticle = ({ actualStatus, idArticle }) => {
  const [newStatus, setNewStatus] = useState(actualStatus);

  const buttons = [
    {
      key: "wait_revisor",
      label: "Esperando Revision",
      background: "#1976D2",
      color: "#fff",
    },
    {
      key: "published",
      label: "Publicar",
      background: "#418944",
      color: "#fff",
    },
    { key: "reject", label: "Rechazar", background: "#D74242", color: "#fff" },
  ];

  const handleStatusChange = (status) => {
    // Lógica para enviar la actualización a través de Axios a la API
    setNewStatus(status);
    if (
      !confirm(`¿Estás seguro que quieres cambiar el artículo
    a estado "${status}"?`)
    ) {
      return;
    }
    console.log("Nuevo estado:", status);
    axios
      .put(`${url_api}/article/change_status/${idArticle}`, {
        status,
      })
      .then((response) => {
        console.log(response.data);
        //Reload page
        window.location.reload();
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
            key={button.key}
            style={
              button.key === actualStatus
                ? { background: button.background, color: button.color }
                : null
            }
            variant={button.key === actualStatus ? "contained" : "outlined"}
            onClick={() => handleStatusChange(button.key)}
          >
            {button.label}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};
