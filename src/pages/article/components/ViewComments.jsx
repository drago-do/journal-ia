import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Image from "next/image";
import { Button } from "@mui/material";
import CommentsDisabledIcon from "@mui/icons-material/CommentsDisabled";
import { comment } from "postcss";

// Definir variable de entorno
const url_api = process.env.API_URL;

export default function ViewComments({ article, status }) {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [userRole, setUserRole] = useState(Cookies.get("role"));
  const userID = Cookies.get("id_user");

  const getCommentsOfArticle = (article) => {
    return new Promise((resolve) => {
      axios
        .get(`${url_api}/commentOfRevisor/${article}`)
        .then((response) => {
          setComments(response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  const userCanViewComments = (status, userRole) => {
    setShowComments(
      userRole === "admin" ||
        userRole === "revisor" ||
        (userRole === "author" && status !== "wait_revisor")
    );
  };

  const filterCommentsByUser = () => {
    if (userRole !== "admin") {
      setComments(comments.filter((comment) => comment.id_user === userID));
    }
  };

  useEffect(() => {
    if (article) {
      getCommentsOfArticle(article).then((comments) => {
        console.log(comments);
        filterCommentsByUser();
      });
    }
  }, [article]);

  useEffect(() => {
    userCanViewComments(status, userRole);
  }, [status, userRole]);

  return (
    <div
      className={`container shadow-md bg-slate-100 p-4 ${
        showComments ? "" : "hidden"
      }`}
    >
      <h6 className="font-sans text-lg font-semibold">
        Comentarios de revisores
      </h6>
      {showComments ? (
        comments.length > 0 ? (
          comments.map((comment, index) => (
            <Comments
              key={index}
              comment={comment}
              forAdmin={userRole === "admin"}
            />
          ))
        ) : (
          <div className="w-full flex flex-col justify-center items-center">
            <h6 className="font-semibold text-lg">
              Parece que aún no hay comentarios.
            </h6>
            <CommentsDisabledIcon />
          </div>
        )
      ) : null}
    </div>
  );
}

const Comments = ({ comment, forAdmin }) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <>
      {comment ? (
        <div className="container border-solid border-2 hover:border-dotted rounded-lg shadow-md border-slate-200 my-2 p-1 flex">
          <div className="w-3/12 md:w-1/12 pl-2 pt-2">
            <Image
              src={"/assets/revisor.png"}
              width={40}
              height={40}
              alt={"Imagen de Perfil de Author"}
            />
          </div>
          <div className="w-full flex flex-col ml-1 grow">
            <div className="font-sans font-semibold my-1">
              {comment.userName}
            </div>
            <div className={showComments ? "block" : "hidden"}>
              <div className="font-sans text-sm bg-slate-100 my-3 rounded shadow-md p-1 border-dotted border-2	border-slate-300">
                <span className="font-bold">Comentario para autor: </span>
                {comment.commentForAuthor}
              </div>
              {forAdmin && (
                <div className="font-sans text-sm bg-slate-100 my-3 rounded shadow-md p-1 border-dotted border-2	border-slate-300">
                  <span className="font-bold">Comentario para admin: </span>
                  {comment.commentForAdmin}
                </div>
              )}
              <div className="font-sans text-sm">
                <p className="font-light mt-5">Preguntas sobre revisión: </p>
                <ol>
                  <li>
                    <span className="italic pr-2">
                      1. ¿Está el tema del artículo dentro del alcance de la
                      revista?
                    </span>
                    <span className="font-semibold">
                      {comment.specific_questions[0]}
                    </span>{" "}
                  </li>
                  <li>
                    <span className="italic pr-2">
                      2. ¿Es esta una contribución original y relevante?
                    </span>
                    <span className="font-semibold">
                      {comment.specific_questions[1]}
                    </span>{" "}
                  </li>
                  <li>
                    <span className="italic pr-2">
                      3. Los objetivos e hipótesis (en los casos que aplique)
                      están claramente expuestos
                    </span>
                    <span className="font-semibold">
                      {comment.specific_questions[2]}
                    </span>{" "}
                  </li>
                  <li>
                    <span className="italic pr-2">
                      4. La metodología está bien indicada y es congruente con
                      los objetivos
                    </span>
                    <span className="font-semibold">
                      {comment.specific_questions[3]}
                    </span>{" "}
                  </li>
                  <li>
                    <span className="italic pr-2">
                      5. ¿Son las figuras y tablas necesarias y aceptables?
                    </span>
                    <span className="font-semibold">
                      {comment.specific_questions[4]}
                    </span>{" "}
                  </li>
                  <li>
                    <span className="italic pr-2">
                      6. Los resultados presentados provienen de datos
                      analizados mediante métodos estadísticos pertinentes
                    </span>
                    <span className="font-semibold">
                      {comment.specific_questions[5]}
                    </span>{" "}
                  </li>
                  <li>
                    <span className="italic pr-2">
                      7. ¿Las interpretaciones / conclusiones son sólidas y
                      están justificadas por los resultados?
                    </span>
                    <span className="font-semibold">
                      {comment.specific_questions[6]}
                    </span>{" "}
                  </li>
                  <li>
                    <span className="italic pr-2">
                      8. ¿Es satisfactoria la organización y extensión del
                      manuscrito?
                    </span>
                    <span className="font-semibold">
                      {comment.specific_questions[7]}
                    </span>{" "}
                  </li>
                  <li>
                    <span className="italic pr-2">
                      9. ¿Es satisfactorio el uso del lenguaje?
                    </span>
                    <span className="font-semibold">
                      {comment.specific_questions[8]}
                    </span>{" "}
                  </li>
                  <li>
                    <span className="italic pr-2">
                      10. ¿Son suficientes y actualizadas las referencias?
                    </span>
                    <span className="font-semibold">
                      {comment.specific_questions[9]}
                    </span>{" "}
                  </li>
                  <li>
                    <span className="italic pr-2">
                      11. La calidad científica del artículo es:
                    </span>
                    <span className="font-semibold">
                      {comment.specific_questions[10]}
                    </span>
                  </li>
                  <li>
                    <span className="italic pr-2">
                      12. Recomendaciones del revisor:
                    </span>
                    <span className="font-semibold">
                      {comment.specific_questions[11]}
                    </span>
                  </li>
                </ol>
              </div>
            </div>
            <Button
              variant="outlined"
              className="text-xs	"
              onClick={() => setShowComments(!showComments)}
            >
              {showComments ? "Ocultar comentarios" : "Mostrar comentarios"}
            </Button>
          </div>
        </div>
      ) : (
        <div>No hay comentarios</div>
      )}
    </>
  );
};
