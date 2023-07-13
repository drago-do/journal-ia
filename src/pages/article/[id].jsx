import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import { Paper, Typography } from "@mui/material";
import Container from "@mui/material";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import { blue, yellow } from "@mui/material/colors";
import Header from "./../components/Header";
import Cookies from "js-cookie";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MainGPT from "./componentsGPT/MainGPT";
import ViewComments from "./components/ViewComments";
import Link from "next/link";
import PDFForm from "./new/PDFForm";

import {
  getCategoryColor,
  getStatusColor,
  getStatusText,
} from "@/util/colorCategoryStatus";

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
  const [articleStatus, setArticleStatus] = useState(null);
  const [secondRevision, setSecondRevision] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [canComment, setCanComment] = useState(false);
  const [canViewStatus, setCanViewStatus] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [urlForNewComment, setUrlForNewComment] = useState(null);
  const [adminCanComment, setAdminCanComment] = useState(false);
  const [iAmTheAuthor, setIAmTheAuthor] = useState(null);
  const [userID, setUserID] = useState(Cookies.get("id_user"));

  const [canAssignRevisor, setCanAssignRevisor] = useState(false);
  const [canGenerateGeneralOpinion, setCanGenerateGeneralOpinion] =
    useState(null);

  const handleAssignRevisor = (value) => {
    setCanAssignRevisor(value);
  };

  const handleAdminCanComment = (value) => {
    setAdminCanComment(value);
  };

  useEffect(() => {
    setUserID(Cookies.get("id_user"));
    // Obtener artículo
    if (id) {
      axios
        .get(`${url_api}/article/${id}`)
        .then((response) => {
          setArticle(response.data);
          setArticleStatus(response.data.status === "wait_revisor");
          setSecondRevision(response.data.status === "partial_reject");
        })
        .catch((error) => {
          console.log(error);
        });
      //Verificar si el articulo ya fue revisado por los revisores
      admin &&
        axios
          .get(`${url_api}/commentOfRevisor/check/${id}`)
          .then((response) => {
            setCanGenerateGeneralOpinion(response.data);
          })
          .catch((err) => {
            console.log(err);
          });
    }
    setAdmin(Cookies.get("role") === "admin" ? true : false);
    thisUserCanComment();
    thisUserCanViewStatusArticle();
    setUrlForNewComment("/article/newComment/" + id);
  }, [id, admin, adminCanComment]);

  useEffect(() => {
    article && getNameOfAuthor(article.author);
    article && userID && console.log(userID === article.author);
    article && userID && console.log(userID + " -- " + article.author);

    article && userID && setIAmTheAuthor(userID === article.author);
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
          if (response.data.assignArticles.includes(id)) {
            setCanComment(true);
            return true;
          }
          return false;
        });
    }
    if (role === "admin") setCanComment(adminCanComment);
    return false;
  };

  function getNameOfAuthor(idAuthor) {
    axios
      .get(`${url_api}/user/${idAuthor}`)
      .then((response) => {
        setAuthorName(response.data.name + " " + response.data.lastname);
      })
      .catch(() => alert("Error al obtener el nombre del autor"));
  }

  //función que actualiza el estado del articulo actual a "wait_revision", después recarga la pagina
  const handleWaitRevision = () => {
    axios
      .put(`${url_api}/article/change_status/${id}`, {
        status: "wait_revisor",
      })
      .then(() => {
        alert("El artículo ha sido enviado a revisión");
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const VisualArticleInfo = () => {
    return (
      <div
        style={{
          marginBottom: "20px",
        }}
        className="flex flex-col sm:flex-row justify-between"
      >
        <span style={infoStyle} className={getCategoryColor(article.category)}>
          {article.category}
        </span>
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
              className={getStatusColor(article.status) + "rounded p-2"}
            >
              {getStatusText(article.status)}
            </Typography>
          )}
          <div className="flex flex-col md:flex-row justify-around">
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
            {!secondRevision && (
              <a href={`${url_api}/pdf/article/${id}`} download>
                <Button
                  variant="contained"
                  fullWidth
                  style={{ background: "#96141c" }}
                >
                  Descargar PDF
                </Button>
              </a>
            )}
            {/* //TODO Agregar componente de subida de pdf nuevo */}
            {secondRevision && iAmTheAuthor && (
              <div className="p-3 border border-solid rounded-lg">
                <div className="p-3 border border-solid border-blue-300 bg-blue-100 rounded-lg">
                  <h6 className="text-xl">
                    Parece que tu articulo requiere una segunda revision
                  </h6>
                  <p className="text-sm italic text-slate-700">
                    La retroalimentación llego a tu correo, intenta corregirlo y
                    sube tu PDF corregido aquí mismo.
                  </p>
                </div>
                <PDFForm
                  idArticle={article._id}
                  isLoadingData={false}
                  handleNext={handleWaitRevision}
                />
              </div>
            )}
            {admin && canAssignRevisor && articleStatus && (
              <AssignArticles article={article} />
            )}
          </div>
          <br />
          <br />
          <br />
          {admin && article && articleStatus && (
            <>
              <MainGPT
                articleID={article._id}
                handleAssignFunction={handleAssignRevisor}
                handleAdminCanComment={handleAdminCanComment}
                canGenerateGeneralOpinion={canGenerateGeneralOpinion}
              />
            </>
          )}
          {articleStatus && (
            <ViewComments article={article._id} status={article.status} />
          )}
          {canComment && (
            <Button
              className="w-full mb-10 mt-2"
              variant="contained"
              style={{ background: "var(--primary-bg-color)" }}
            >
              <Link className="w-full" href={urlForNewComment}>
                Agregar nuevo comentario
              </Link>
            </Button>
          )}
          {/* Añade el botón de descarga del PDF */}
        </div>
      )}
    </div>
  );
}

const AssignArticles = ({ article }) => {
  const [revisorUsers, setRevisorUsers] = useState();
  const [open, setOpen] = React.useState(false);
  const [revisorSelected, setRevisorSelected] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    if (value !== null) setRevisorSelected(value);
  };

  useEffect(() => {
    getRevisorUsers();
  }, []);

  useEffect(() => {
    if (revisorSelected !== null) assignRevisorToArticle();
  }, [revisorSelected]);

  const assignRevisorToArticle = () => {
    axios
      .put(`${url_api}/user/assignArticles/${revisorSelected._id}`, {
        idArticle: article._id,
      })
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getRevisorUsers = () => {
    axios
      .get(`${url_api}/user`)
      .then((response) => {
        let allUsers = response.data;
        let revisorUsers = allUsers.filter((user) => user.role === "revisor");
        setRevisorUsers(revisorUsers);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Asignar a revisor
      </Button>
      <AssignArticlesSimpleDialog
        open={open}
        onClose={handleClose}
        revisorUsers={revisorUsers}
        articleID={article._id}
      />
    </div>
  );
};

function AssignArticlesSimpleDialog(props) {
  const { onClose, open, revisorUsers, articleID } = props;

  const handleClose = () => {
    onClose(null);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Selecciona un revisor para asignarlo</DialogTitle>
      <List sx={{ pt: 0 }}>
        {revisorUsers &&
          revisorUsers.map((revisor, index) => (
            <ListItem disableGutters key={index}>
              <ListItemButton
                onClick={() => handleListItemClick(revisor)}
                key={index}
                style={{ justifyContent: "space-between" }}
              >
                <div style={{ display: "flex" }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: yellow[100], color: blue[600] }}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <div>
                    <ListItemText
                      primary={revisor.name + " " + revisor.lastname}
                    />
                    <ListItemText primary={revisor.email} />
                  </div>
                </div>
                {
                  // Verifica si el usuario ya tiene el articulo asignado
                  revisor.assignArticles.includes(articleID) ? (
                    <CheckCircleIcon />
                  ) : null
                }
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Dialog>
  );
}
