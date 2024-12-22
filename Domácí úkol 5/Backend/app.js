const express = require("express");
const connectDB = require("./db");
const cors = require("cors");
const shoppingListsRoutes = require("./routes/shoppingLists");
const itemsRoutes = require("./routes/items");
const membersRoutes = require("./routes/members");


const app = express();
connectDB();
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    console.log("Headers:", req.headers);
    next();
  });

// Použití rout
app.use("/shoppingLists", shoppingListsRoutes);
app.use("/items", itemsRoutes);
app.use("/members", membersRoutes);

module.exports = app; // Export aplikace