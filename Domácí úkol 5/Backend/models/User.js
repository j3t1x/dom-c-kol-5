const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Jméno uživatele
  email: { type: String, required: true, unique: true }, // E-mail (unikátní)
  password: { type: String, required: true }, // Heslo 
  createdAt: { type: Date, default: Date.now }, // Datum registrace
});

module.exports = mongoose.model("User", UserSchema);
