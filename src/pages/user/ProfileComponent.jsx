import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import ArticleIcon from "@mui/icons-material/Article";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

//Components Views
import ProfileView from "./ProfileView";
import ArticlesView from "./ArticlesView";
import UsersView from "./UsersView";

//Definir variable de entorno
const url_api = process.env.API_URL;

export default function ProfileComponent() {
  const [value, setValue] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRevisor, setIsRevisor] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getUserRole = () => {
    const role = Cookies.get("role");
    if (role === "admin") setIsAdmin(true);
    if (role === "revisor") setIsRevisor(true);
    if (role === "author") setIsAuthor(true);
  };

  useEffect(() => {
    getUserRole();
  }, []);

  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="icon label tabs example"
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
      >
        <Tab icon={<AccountCircleIcon />} label="Perfil" />
        {(isAdmin || isRevisor) && (
          <Tab icon={<DocumentScannerIcon />} label="Pendientes" />
        )}
        {isAdmin && <Tab icon={<ArticleIcon />} label="Publicados" />}
        {isAdmin && <Tab icon={<ArticleIcon />} label="Rechazados" />}
        {isAdmin && <Tab icon={<ArticleIcon />} label="Segunda" />}
        {isAdmin && <Tab icon={<ManageAccountsIcon />} label="Usuarios" />}
        {isAuthor && <Tab icon={<ArticleIcon />} label="Mis Artículos" />}{" "}
      </Tabs>
      <ShowView viewToShow={value} />
    </>
  );
}

const ShowView = ({ viewToShow }) => {
  switch (viewToShow) {
    case 0:
      return <ProfileView />;
    case 1:
      return <ArticlesView showArticlesOf="pendentsAdmin" />;
    case 2:
      return <ArticlesView showArticlesOf="publishedAdmin" />;
    case 3:
      return <ArticlesView showArticlesOf="rejectedAdmin" />;
    case 4:
      return <ArticlesView showArticlesOf="secondAdmin" />;
    case 5:
      return <UsersView />;
    case 6:
      return <ArticlesView showArticlesOf="author" />;
    default:
      return <ProfileView />;
  }
};
