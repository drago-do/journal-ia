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
import Box from "@mui/material/Box";
import Image from "next/image";
import { Cookie } from "next/font/google";
import axios from "axios";
import ProfileComponent from "./ProfileComponent";

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
