const { Router } = require("express");
const router = Router();
const CommentOfRevisor = require("./../models/CommentOfRevisor");

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

module.exports = router;
