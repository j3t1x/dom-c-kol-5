const express = require("express");
const router = express.Router();
const authorizeListRole = require("../middleware/authorizeListRole");
const ShoppingList = require("../models/ShoppingList");

// Přidání nového seznamu
router.post('/add', async (req, res) => {
  const { title } = req.body; 
  const ownerId = req.headers['user-id']; 


  if (!title || !ownerId) {
    return res.status(400).json({ error: "Title and user ID are required" });
  }

  try {
    const newShoppingList = new ShoppingList({
      title,
      members: [{ userId: ownerId, role: "Owner" }],
      isArchived: false,
      items: [],
    });

    const savedShoppingList = await newShoppingList.save();
    res.status(201).json({
      status: "success",
      shoppingListId: savedShoppingList._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Získání seznamů viditelných pro uživatele
router.get("/my-lists", async (req, res) => {
  const userId = req.headers["user-id"];

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const shoppingLists = await ShoppingList.find({
      "members.userId": userId,
      isArchived: false, // Pouze aktivní seznamy
    });

    res.status(200).json({ status: "success", shoppingLists });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/archived-lists", async (req, res) => {
  const userId = req.headers["user-id"];

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const archivedLists = await ShoppingList.find({
      "members.userId": userId,
      isArchived: true, // Pouze archivované seznamy
    });

    res.status(200).json({ status: "success", shoppingLists: archivedLists });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Aktualizace stavu archivace seznamu
router.patch("/:listId/archive", async (req, res) => {
  const { listId } = req.params;
  const { isArchived } = req.body; // Předpokládáme, že klient pošle nový stav archivace

  try {
    const shoppingList = await ShoppingList.findById(listId);

    if (!shoppingList) {
      return res.status(404).json({ error: "Shopping list not found" });
    }

    shoppingList.isArchived = isArchived; // Nastavení nového stavu archivace
    await shoppingList.save();

    res.status(200).json({ status: "success", updatedShoppingList: shoppingList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Získání jednoho seznamu podle ID (jen pro členy)
router.get("/:listId", authorizeListRole("Member"), async (req, res) => {
  const { listId } = req.params;

  try {
    const shoppingList = await ShoppingList.findById(listId);
    if (!shoppingList) {
      return res.status(404).json({ error: "Shopping list not found" });
    }

    res.status(200).json({ shoppingList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Aktualizace názvu seznamu (jen pro vlastníka)
router.put("/:listId", authorizeListRole("Owner"), async (req, res) => {
  const { listId } = req.params;
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const shoppingList = await ShoppingList.findById(listId);
    if (!shoppingList) {
      return res.status(404).json({ error: "Shopping list not found" });
    }

    shoppingList.title = title;
    await shoppingList.save();

    res.status(200).json({ status: "success", updatedShoppingList: shoppingList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Odstranění seznamu (jen pro vlastníka)
router.delete("/:listId", authorizeListRole("Owner"), async (req, res) => {
  const { listId } = req.params;

  try {
    const shoppingList = await ShoppingList.findByIdAndDelete(listId);
    if (!shoppingList) {
      return res.status(404).json({ error: "Shopping list not found" });
    }

    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Získání archivovaných seznamů


module.exports = router;
