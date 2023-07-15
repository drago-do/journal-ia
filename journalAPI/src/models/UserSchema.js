// models/User.js

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "revisor", "author", "user"],
    default: "author",
  },
  assignArticles: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "articles",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("Users", UserSchema);

module.exports = User;
