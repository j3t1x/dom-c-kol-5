const express = require("express");
const router = express.Router();
const authorize = require("../middleware/authorizeListRole");
const ShoppingList = require("../models/ShoppingList");
const mongoose = require("mongoose");


// Add a member
router.post("/:listId/add-member", async (req, res) => {
  const { listId } = req.params;
  const { memberId } = req.body;
  const ownerId = req.headers["user-id"];

  if (!listId || !memberId) {
    return res.status(400).json({ error: "List ID and Member ID are required." });
  }

  try {
    const shoppingList = await ShoppingList.findById(listId);
    if (!shoppingList) {
      return res.status(404).json({ error: "Shopping list not found." });
    }

    // Ověř vlastnictví seznamu
    const owner = shoppingList.members.find(
      (member) => member.userId.toString() === ownerId && member.role === "Owner"
    );
    console.log("Owner found:", owner);
    if (!owner) {
      return res.status(403).json({ error: "Only the owner can add members." });
    }

    // Ověř, zda uživatel není již členem
    const existingMember = shoppingList.members.find(
      (member) => member.userId.toString() === memberId
    );
    if (existingMember) {
      return res.status(400).json({ error: "User is already a member of the list." });
    }

    // Přidej nového člena
    shoppingList.members.push({ userId: memberId, role: "Member" });
    await shoppingList.save();

    res.status(201).json({ message: "Member added successfully." });
  } catch (error) {
    console.error("Error while adding member:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});



// Remove a member
router.delete("/:listId/:memberId", authorize("Owner"), async (req, res) => {
  const { listId, memberId } = req.params;

  try {
    const shoppingList = await ShoppingList.findById(listId);
    if (!shoppingList) {
      return res.status(404).json({ error: "Shopping list not found" });
    }

    // Filtruj členy podle userId
    shoppingList.members = shoppingList.members.filter(
      (m) => m.userId.toString() !== memberId
    );
    await shoppingList.save();

    res.status(200).json({ status: "success", message: "Member removed successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Member leaves the shopping list
router.delete("/:listId/leave", authorize("Member"), async (req, res) => {
  console.log("Reached /leave endpoint");
  const { listId } = req.params;
  const memberId = req.headers["user-id"];
  console.log("List ID:", listId);
  console.log("User ID:", memberId);

  if (!memberId) {
    return res.status(400).json({ error: "User ID is required in headers" });
  }

  try {
    const shoppingList = await ShoppingList.findById(listId);
    if (!shoppingList) {
      return res.status(404).json({ error: "Shopping list not found" });
    }

    console.log("Members before filtering:", shoppingList.members);

    shoppingList.members = shoppingList.members.filter(
      (m) => m.userId.toString() !== memberId
    );

    console.log("After filtering members:", shoppingList.members);

    await shoppingList.save();

    res.status(200).json({
      status: "success",
      message: "You have left the shopping list.",
    });
  } catch (error) {
    console.error("Error while leaving the list:", error);
    res.status(500).json({ error: error.message });
  }
});






module.exports = router;
