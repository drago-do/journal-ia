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
    enum: ["user", "admin", "revisor", "author"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Check if the model has already been compiled before defining it again
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
