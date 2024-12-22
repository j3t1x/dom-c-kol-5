const mongoose = require("mongoose");

// Schema pro členy seznamu
const MemberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["Owner", "Member"], required: false },
});

// Schema pro položky seznamu
const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  purchased: { type: Boolean, default: false }, 
});



// Schema pro nákupní seznamy
const ShoppingListSchema = new mongoose.Schema({
  title: { type: String, required: true },
  members: [MemberSchema],
  items: [ItemSchema],
  isArchived: { type: Boolean, default: false },
});

module.exports = mongoose.model("ShoppingList", ShoppingListSchema);
