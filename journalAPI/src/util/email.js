const Article = require("../models/ArticleSchema");
const CommentOfRevisor = require("./../models/CommentOfRevisor");
const User = require("../models/UserSchema");
var nodemailer = require("nodemailer");

const email = process.env.EMAIL;
const password = process.env.EMAIL_PASSWORD;

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass: password,
  },
});

var mailOptions = {
  from: email,
  to: "",
  subject: "Resultados de tu articulo. JournalIA",
  text: "",
};

async function getArticle(idArticle) {
  return new Promise((resolve, reject) => {
    Article.findOne({ _id: idArticle })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.log(error);
        reject(false);
      });
  });
}
async function getUserInfo(idUser) {
  return new Promise((resolve, reject) => {
    User.findOne({ _id: idUser })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.log(error);
        reject(false);
      });
  });
}

//Función que recibe la información, y la envía al destinatario
export async function sendEmailForArticle(idArticle) {
  //Buscamos el Artículo por su ID para obtener los datos del autor
  const { title, author, status } = await getArticle(idArticle);
  //Buscamos la información del usuario
  const { name, lastname, email } = await getUserInfo(author);
  //Buscamos los comentarios realizados a este articulo
  let comments = await CommentOfRevisor.find({ article_ref: idArticle });
  //Formateamos los comentarios
  comments = formatComments(comments);
  //Formateamos el correo entero
  const emailToSend = formatEmailToSend(
    title,
    name,
    lastname,
    comments,
    status
  );
  //Enviamos el correo
  mailOptions.to = email;
  mailOptions.text = emailToSend;

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

function formatEmailToSend(title, name, lastname, formatComments, status) {
  let textEmail = `Hola ${name + " " + lastname}\n
  Se reviso con éxito tu articulo ${title} y ahora su estatus es: ${status}\n\n
  Los revisores comentaron lo siguiente: \n
  ${formatComments}\n`;
  return textEmail;
}

function formatComments(comments) {
  let formatComments = "";
  comments.map((comment) => {
    formatComments += "Comentarios de: " + comment.userName + "\n";
    formatComments += comment.commentForAuthor + "\n";
    formatComments += "--\n";
    formatComments += `
                  1. ¿Está el tema del artículo dentro del alcance de la
                  revista? ${comment.specific_questions[0]}\n 
                  2. ¿Es esta una contribución original y relevante? ${comment.specific_questions[1]}\n
                  3. Los objetivos e hipótesis (en los casos que aplique) están
                  claramente expuestos ${comment.specific_questions[2]}\n
                  4. La metodología está bien indicada y es congruente con los
                  objetivos ${comment.specific_questions[3]}\n
                  5. ¿Son las figuras y tablas necesarias y aceptables? ${comment.specific_questions[4]}\n
                  6. Los resultados presentados provienen de datos analizados
                  mediante métodos estadísticos pertinentes ${comment.specific_questions[5]}\n
                  7. ¿Las interpretaciones / conclusiones son sólidas y están
                  justificadas por los resultados? ${comment.specific_questions[6]}\n
                  8. ¿Es satisfactoria la organización y extensión del
                  manuscrito? ${comment.specific_questions[7]}\n
                  9. ¿Es satisfactorio el uso del lenguaje? ${comment.specific_questions[8]}\n
                  10. ¿Son suficientes y actualizadas las referencias? ${comment.specific_questions[9]}\n
                  11. La calidad científica del artículo es: ${comment.specific_questions[10]}\n
                  12. Recomendaciones del revisor ${comment.specific_questions[11]}\n`;
  });
  return formatComments;
}

// transporter.sendMail(mailOptions, function (error, info) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Email sent: " + info.response);
//   }
// });
