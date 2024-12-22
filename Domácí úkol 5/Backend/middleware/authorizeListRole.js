const ShoppingList = require("../models/ShoppingList");

function authorize(requiredRole) {
  return async (req, res, next) => {
    const userId = req.headers["user-id"];
    const shoppingListId = req.params.listId || req.body.listId;

    console.log("Middleware User ID:", userId);
    console.log("Middleware Shopping List ID:", shoppingListId);
    console.log("Middleware reached for route:", req.method, req.url);
    console.log("Headers:", req.headers);


    if (!userId || !shoppingListId) {
      return res.status(400).json({ error: "User ID and List ID are required" });
    }

    try {
      const shoppingList = await ShoppingList.findById(shoppingListId);
      if (!shoppingList) {
        return res.status(404).json({ error: "Shopping list not found" });
      }

      const userRole = shoppingList.members.find(
        (member) => member.userId.toString() === userId
      )?.role;

      console.log("Required Role:", requiredRole);
      console.log("User Role Found:", userRole);

      // Správná kontrola pro Member a Owner
      if (
        !userRole ||
        (requiredRole === "Owner" && userRole !== "Owner") ||
        (requiredRole === "Member" && !["Member", "Owner"].includes(userRole))
      ) {
        console.log("Access denied: Role mismatch.");
        return res.status(403).json({ error: "Access denied. Insufficient permissions." });
      }

      next();
    } catch (error) {
      console.error("Error in authorize middleware:", error);
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = authorize;

