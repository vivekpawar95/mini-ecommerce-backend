const express = require("express");
const usersRoutes = require("./routes/users-routes");
const productsRoutes = require("./routes/products-routes");
const publicRoutes = require("./routes/public-routes");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/auth-middleware");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use("/users", authMiddleware, usersRoutes);
app.use("/products", authMiddleware, productsRoutes);

app.use("/public", authMiddleware, publicRoutes);

app.listen(3000, () => {
  console.log("node server is running on localhost:3000");
});
