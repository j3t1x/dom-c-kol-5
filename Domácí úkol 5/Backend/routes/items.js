const express = require("express");
const router = express.Router();
const authorizeListRole = require("../middleware/authorizeListRole");
const ShoppingList = require("../models/ShoppingList");

//add item to list
router.post("/:listId/add", async (req, res) => {
  const { listId } = req.params;
  const { itemName, quantity } = req.body;

  if (!itemName || !quantity) {
    return res.status(400).json({ error: "Item name and quantity are required" });
  }

  try {
    const shoppingList = await ShoppingList.findById(listId);
    if (!shoppingList) {
      return res.status(404).json({ error: "Shopping list not found" });
    }

    const newItem = { name: itemName, quantity, purchased: false };
    shoppingList.items.push(newItem);

    await shoppingList.save();
    res.status(201).json({ status: "success", item: newItem });
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



router.delete("/:listId/:itemId", authorizeListRole(["Member", "Owner"]), async (req, res) => {
  const { listId, itemId } = req.params;

  // Validace vstupních parametrů
  if (!listId || !itemId) {
      return res.status(400).json({ error: "List ID and item ID are required" });
  }

  try {
      const shoppingList = await ShoppingList.findById(listId); 
      if (!shoppingList) {
          return res.status(404).json({ error: "Shopping list not found" });
      }

      const itemExists = shoppingList.items.some((item) => item._id.toString() === itemId);
      if (!itemExists) {
          return res.status(404).json({ error: "Item not found" });
      }

      shoppingList.items = shoppingList.items.filter((item) => item._id.toString() !== itemId);
      await shoppingList.save();

      res.status(200).json({ status: "success" });
  } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: error.message });
  }
});


// Toggle item status
router.patch("/:listId/:itemId", async (req, res) => {
  const { listId, itemId } = req.params;
  const { purchased } = req.body;

  try {
    const shoppingList = await ShoppingList.findById(listId);
    if (!shoppingList) {
      return res.status(404).json({ error: "Shopping list not found" });
    }

    const item = shoppingList.items.id(itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    item.purchased = purchased;
    await shoppingList.save();

    res.status(200).json({ status: "success", item });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;