const { Router } = require("express");
const router = Router();
const CommentOfRevisor = require("./../models/CommentOfRevisor");
const User = require("../models/UserSchema");

//Create CommentOfRevisor
router.post("/", (req, res) => {
  const dataCommentOfRevisor = CommentOfRevisor(req.body);
  dataCommentOfRevisor
    .save()
    .then((data) => {
      console.log("datos:");
      console.log(data);
      res.json(data);
    })
    .catch((error) => res.json({ message: error }));
});

// Obtener todos los CommentOfRevisor de un artículo
router.get("/:articleRef", async (req, res) => {
  try {
    const { articleRef } = req.params;
    const comments = await CommentOfRevisor.find({ article_ref: articleRef });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update CommentOfRevisor by id
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;

  CommentOfRevisor.findOneAndUpdate(
    { _id: id },
    updatedFields,
    { new: true },
    (err, updatedCommentOfRevisor) => {
      if (err) {
        res.status(500).json({ success: false, message: err.message });
      } else {
        res.status(200).json({ success: true, data: updatedCommentOfRevisor });
      }
    }
  );
});

//Delete CommentOfReviso by id
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  CommentOfRevisor.findByIdAndDelete(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//Revisa si todos los revisores ya han comentado el articulo a revisar.
router.get("/check/:articleRef", async (req, res) => {
  try {
    const { articleRef } = req.params;
    //Obtiene todos los comentarios que existen del articulo
    const comments = await CommentOfRevisor.find({ article_ref: articleRef });
    //Obtiene el id de los usuarios que han comentado
    const usersWithComment = comments.map((comment) => comment.id_user);
    //Obtiene todos los usuarios con el articulo asignado
    const users = await User.find({ assignArticles: articleRef });
    //Obtiene el id de los usuarios que lo tienen asignado
    const usersWithArticle = users.map((user) => user._id);
    //Compara los usuarios que tienen el articulo asignado con los que han comentado
    const usersWithoutComment = usersWithArticle.filter(
      (user) =>
        !usersWithComment.some(
          (commentUserId) => commentUserId.toString() === user.toString()
        )
    );
    //Si no hay usuarios sin comentar, devuelve true
    if (usersWithoutComment.length === 0) {
      res.json(true);
    }
    //Si hay usuarios sin comentar, regresa los datos completos de los usuarios que faltan
    else {
      const usersData = await User.find({ _id: usersWithoutComment });
      console.log(
        "Los que faltan: ________________________________________________"
      );
      console.log(usersData);

      res.json(usersData);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
