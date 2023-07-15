const { Router } = require("express");
const router = Router();
const User = require("../models/UserSchema");
const Article = require("../models/ArticleSchema");

//Create user
router.post("/", (req, res) => {
  const dataUser = User(req.body);
  dataUser
    .save()
    .then((data) => {
      console.log("datos:");
      console.log(data);
      res.json(data);
    })
    .catch((error) => res.json({ message: error }));
});

//Get all user's
router.get("/", (req, res) => {
  User.find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//Get one user by id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// Update user by id
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;

  User.findOneAndUpdate(
    { _id: id },
    updatedFields,
    { new: true },
    (err, updatedUser) => {
      if (err) {
        res.status(500).json({ success: false, message: err.message });
      } else {
        res.status(200).json({ success: true, data: updatedUser });
      }
    }
  );
});

//Delete user by id
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  User.findByIdAndDelete(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//Verify credentials user and pass if is true return user
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email, password })
    .then((data) => {
      if (data) {
        res.json({ success: true, data: data });
      } else {
        res.json({ success: false, message: "User or password incorrect" });
      }
    })
    .catch((error) => res.json({ success: false, message: error }));
});

// Assign articles to revisor
router.put("/assignArticles/:idUser", async (req, res) => {
  try {
    const { idUser } = req.params;
    const { idArticle } = req.body;

    const user = await User.findById(idUser);

    if (user.assignArticles.includes(idArticle)) {
      await User.findByIdAndUpdate(idUser, {
        $pull: { assignArticles: idArticle },
      });
    } else {
      await User.findByIdAndUpdate(idUser, {
        $push: { assignArticles: idArticle },
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/assignedArticles/:idUser", (req, res) => {
  const { idUser } = req.params;
  User.findById(idUser)
    .populate("assignArticles")
    .then((user) => {
      if (!user) {
        console.log("usuario no existe");
        res.json({ success: false, message: "User not found" });
        return;
      }
      res.json(user.assignArticles);
    })
    .catch((error) => {
      console.log(error);
      res.json({ success: false, message: error });
    });
});

//Remove article to revisor
router.put("/removeArticles/:idUser", (req, res) => {
  const { idUser } = req.params;
  const { idArticle } = req.body;
  User.findByIdAndUpdate(idUser, { $pull: { assignArticles: idArticle } })
    .then((data) => {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, message: error });
    });
});

module.exports = router;
