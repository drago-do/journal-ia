import React from "react";
import Cookies from "js-cookie";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import ArticleCardRevision from "./../components/ArticleCardRevision";

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
            src={userPicture}
            alt="Profile Picture"
            width={100}
            height={100}
            style={{ width: "50%", height: "50%", borderRadius: "50%" }}
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
  const [authorId, setAuthorId] = useState(null);
  const [userRol, setUserRol] = useState(null);

  useEffect(() => {
    setAuthorId(Cookies.get("id_user"));

    //Get user role
    axios
      .get(`http://localhost:3001/user/${authorId}`)
      .then((response) => {
        setUserRol(response.data.role);
      })
      .then(() => {
        //Get articles
        axios
          .get(`http://localhost:3001/article/author/${authorId}`)
          .then((data) => {
            setMyArticles(data.data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });

    handleInfoClick();
  }, [authorId]);

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
          <Link href={"/article/new/update"}>
            <Button variant="outlined">Subir nueva publicación</Button>
          </Link>
          <Typography variant="h4">Mis publicaciones</Typography>
          {myArticles &&
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
          {userRol != "author" ? (
            <></>
          ) : (
            <Button variant="outlined" onClick={handlePostsClick}>
              Mis publicaciones
            </Button>
          )}
          <Button variant="outlined" color="error" onClick={handleLogoutClick}>
            Cerrar sesión
          </Button>
        </div>
        <Box>{content && <Typography variant="h4">{content}</Typography>}</Box>
      </div>
    </div>
  );
};
