const express = require("express");
const usersRoutes = require("./routes/users-routes");
const productsRoutes = require("./routes/products-routes");

const app = express();
app.use(express.json());

app.use(usersRoutes);
app.use(productsRoutes);

app.listen(3000, () => {
  console.log("node server is running on localhost:3000");
});
