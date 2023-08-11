const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  plan: String,
  storage: Number,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
