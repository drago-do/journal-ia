const { Router } = require("express");
const router = Router();
const User = require("../models/UserSchema");

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

module.exports = router;
