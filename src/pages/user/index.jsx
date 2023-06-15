import React from "react";
import Cookies from "js-cookie";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import ArticleCardRevision from "./../components/ArticleCardRevision";
import UserCard from "../components/UserCard";

//Definir variable de entorno
const url_api = process.env.API_URL;

export default function User() {
  useEffect(() => {
    const id_user = Cookies.get("id_user");
    if (!id_user) {
      window.location.href = "/";
    }
  }, []);

  return (
    <div>
      {/* Contenedor centrado. Dentro de fondo un paisaje y en medio la foto de perfil y su nombre debajo */}
      <UserProfile />
      {/* Contenedor con 3 botones: Mis publicaciones, Mis favoritos, Cerrar sesión */}
      <ProfileComponent />
    </div>
  );
}

import { Box } from "@mui/material";
import Image from "next/image";
import { Cookie } from "next/font/google";
import axios from "axios";

const UserProfile = () => {
  const [userPicture, setUserPicture] = React.useState("");
  const [userName, setUserName] = React.useState("");

  React.useEffect(() => {
    setUserName(Cookies.get("name") + " " + Cookies.get("lastname"));
    const role = Cookies.get("role");
    if (role === "user") {
      setUserPicture("/assets/user.png");
    }
    if (role === "admin") {
      setUserPicture("/assets/admin.png");
    }
    if (role === "revisor") {
      setUserPicture("/assets/revisor.png");
    }
    if (role === "author") {
      setUserPicture("/assets/author.png");
    }
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        backgroundImage: "linear-gradient(to left, #FF5733, #2681AC)",
      }}
    >
      <Box
        sx={{ textAlign: "center", padding: "16px", alignContent: "center" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Image
            src={userPicture || "/assets/user.png"}
            alt="Profile Picture"
            width={100}
            height={100}
            style={{ width: "50%", height: "50%", borderRadius: "50%" }}
            priority
          />
          <Typography
            variant="h4"
            sx={{ marginTop: "16px" }}
            display={{
              borderRadius: "15px",
              background: "#fff",
              padding: "5px",
            }}
          >
            {userName}
          </Typography>
        </div>
      </Box>
    </Box>
  );
};

const ProfileComponent = () => {
  const [content, setContent] = useState("");
  const [myArticles, setMyArticles] = useState(null);
  const [userID, setUserID] = useState(null);
  const [userRol, setUserRol] = useState(null);
  const [allUsers, setAllUsers] = useState(null);

  useEffect(() => {
    handleInfoClick();
    getArticlesByRole();
    if (userRol === "admin") getAllUsers();
  }, [userID]);

  const getArticlesByRole = () => {
    setUserID(Cookies.get("id_user"));
    setUserRol(Cookies.get("role"));
    let isAdmin = false;

    const routeForRole = () => {
      if (userRol === "revisor") return "/user/assignedArticles/";
      if (userRol === "author") return "/article/author/";
      if (userRol === "admin") {
        isAdmin = true;
        return "/article/";
      }
    };

    const route = routeForRole();
    const userIDRoute = isAdmin ? "" : userID;


    userIDRoute != null
      ? axios
          .get(`${url_api}${route}${userIDRoute}`)
          .then((response) => {
            let articlesResponse =
              response.data.length > 0 ? response.data : undefined;
            setMyArticles(articlesResponse);
          })
          .catch((error) => {
            console.log(error);
          })
      : null;
  };

  const getAllUsers = () => {
    axios
      .get(`${url_api}/user/`)
      .then((response) => {
        setAllUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleInfoClick = () => {
    setContent(() => {
      return (
        <div>
          <Typography variant="h4">Mi información</Typography>
          <Typography variant="h5">Nombre: {Cookies.get("name")}</Typography>
          <Typography variant="h5">
            Apellido: {Cookies.get("lastname")}
          </Typography>
          <Typography variant="h5">Correo: {Cookies.get("email")}</Typography>
          <Typography variant="h5">Rol: {Cookies.get("role")}</Typography>
        </div>
      );
    });
  };

  const handlePostsClick = () => {
    setContent(() => {
      return (
        //Mostrar los artículos publicados
        <div>
          {userRol == "revisor" || userRol == "admin" ? null : (
            <Link href={"/article/new/update"}>
              <Button variant="outlined">Subir nueva publicación</Button>
            </Link>
          )}

          <Typography variant="h4">
            {userRol == "revisor" || userRol == "admin"
              ? "Mis asignaciones"
              : "Mis publicaciones"}
          </Typography>
          {myArticles ? (
            myArticles.map((article, index) => {
              return (
                <ArticleCardRevision
                  key={index}
                  id={article._id}
                  title={article.title}
                  abstract={article.abstract}
                  author={article.author}
                  category={article.category}
                  status={article.status}
                  created_at={article.created_at}
                />
              );
            })
          ) : (
            <Typography variant="h6"> No hay artículos.</Typography>
          )}
        </div>
      );
    });
  };

  const handleUserClick = () => {
    setContent(() => {
      return (
        <div>
          <Typography variant="h4">Usuarios</Typography>
          {allUsers &&
            allUsers.map((user, index) => {
              return (
                <UserCard
                  key={index}
                  id={user._id}
                  name={user.name}
                  lastname={user.lastname}
                  email={user.email}
                  role={user.role}
                />
              );
            })}
        </div>
      );
    });
  };

  const handleLogoutClick = () => {
    //Delete all cookies of user and return to main page
    Cookies.remove("id_user");
    Cookies.remove("name");
    Cookies.remove("lastname");
    Cookies.remove("email");
    Cookies.remove("role");
    window.location.href = "/";
  };

  const showOptionsFor = (userRole) => {
    switch (userRole) {
      case "author":
        return (
          <Button variant="outlined" onClick={handlePostsClick}>
            Mis publicaciones
          </Button>
        );
        break;
      case "admin":
        return (
          <>
            <Button variant="outlined" onClick={handlePostsClick}>
              Revisar Artículos
            </Button>
            <Button variant="outlined" onClick={handleUserClick}>
              Usuarios
            </Button>
          </>
        );
        break;
      case "revisor":
        return (
          <Button variant="outlined" onClick={handlePostsClick}>
            Mis asignaciones
          </Button>
        );
        break;
      default:
        break;
    }
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginTop: "10px",
      }}
    >
      <div style={{ width: "70%" }}>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button variant="outlined" onClick={handleInfoClick}>
            Mi información
          </Button>
          {showOptionsFor(userRol)}
          <Button variant="outlined" color="error" onClick={handleLogoutClick}>
            Cerrar sesión
          </Button>
        </div>
        <Box>{content && <Typography variant="h4">{content}</Typography>}</Box>
      </div>
    </div>
  );
};
