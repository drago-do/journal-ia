import React, { useState, useEffect } from "react";
import axios from "axios";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Cookies from "js-cookie";
import Link from "next/link";
import { Button } from "@mui/material";
import Image from "next/image";

import {
  getCategoryColor,
  getStatusColor,
  getStatusText,
} from "@/util/colorCategoryStatus";

//Definir variable de entorno
const url_api = process.env.API_URL;

export default function ArticlesView({ showArticlesOf }) {
  const [articles, setArticles] = useState(null);
  const [buttonUpdateArticle, setButtonUpdateArticle] = useState(false);

  const getArticlesByRole = async () => {
    const userRole = await Cookies.get("role");
    const userID = await Cookies.get("id_user");
    let isAdmin = false;
    let route = "";
    if (userRole === "revisor") route = "/user/assignedArticles/";
    if (userRole === "author") {
      route = "/article/author/";
      setButtonUpdateArticle(true);
    }
    if (userRole === "admin") {
      isAdmin = true;
      route = "/article/";
    }
    const userIDRoute = isAdmin ? "" : userID;
    userIDRoute != null
      ? axios
          .get(`${url_api}${route}${userIDRoute}`)
          .then((response) => {
            let articlesResponse =
              response.data.length > 0 ? response.data : null;
            articlesResponse = articlesResponse.reverse();
            filterArticles(articlesResponse);
          })
          .catch((error) => {
            console.log(error);
          })
      : null;
  };

  const filterArticles = (articlesResponse) => {
    console.log(showArticlesOf);

    let articlesFiltered = articlesResponse.filter((article) => {
      switch (showArticlesOf) {
        case "pendentsAdmin":
          return article.status === "wait_revisor";
        case "publishedAdmin":
          return article.status === "published";
        case "rejectedAdmin":
          return article.status === "reject";
        case "secondAdmin":
          return article.status === "partial_reject";
        case "author":
          return article;
        default:
          return article;
      }
    });
    setArticles(articlesFiltered);
  };

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", options);
  }

  useEffect(() => {
    getArticlesByRole();
  }, [showArticlesOf]);

  return (
    <div className="container w-full flex justify-center">
      <div className="flex flex-col w-11/12">
        {buttonUpdateArticle && (
          <Link className="w-full mt-3" href={"/article/new/update"}>
            <Button className="w-full" variant="outlined">
              Subir nueva publicación
            </Button>
          </Link>
        )}
        {articles && articles.length > 0 ? (
          articles.map((article, index) => {
            return (
              <Link
                href={"/article/" + article._id}
                key={index}
                className="flex flex-row justify-between items-center rounded-md p-2 my-4 "
              >
                <AssignmentIcon />
                <div className="flex flex-col px-3 grow items-start whitespace-nowrap overflow-hidden">
                  <h4
                    className="overflow-hidden overflow-ellipsis"
                    style={{ maxWidth: "95%" }}
                  >
                    {article.title}
                  </h4>
                  <p>{formatDate(article.created_at)}</p>
                </div>
                <div className="flex flex-col items-end whitespace-nowrap">
                  <p className={getCategoryColor(article.category)}>
                    {article.category}
                  </p>
                  <p className={getStatusColor(article.status)}>
                    {getStatusText(article.status)}
                  </p>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="w-full flex flex-col items-center my-7">
            <Image
              src={"/assets/vacio.png"}
              width={200}
              height={200}
              alt="Vació"
            />
            <h1 className="font-semibold text-neutral-700 text-2xl text-center">
              Parece que aun no hay artículos que mostrar
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
