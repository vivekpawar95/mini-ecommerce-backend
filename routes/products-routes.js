const express = require("express");

const router = express.Router();

const pool = require("../utilities/db");

router.get("/products", async (req, res) => {
  try {
    const [products] = await pool.query("select * from products");
    return res
      .status(200)
      .json({ message: "successfully products fetched", data: products });
  } catch {
    return res.status(500).json({ message: "an error occured" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [product] = await pool.query("select * from products where id=?", [
      id,
    ]);
    if (product.length == 0) {
      return res.status(404).json({ message: "product not found" });
    }
    const [theProduct] = product;
    return res
      .status(200)
      .json({ message: "successfully products fetched", data: theProduct });
  } catch (e) {
    console.log(e);

    return res.status(500).json({ message: "an error occured" });
  }
});

router.post("/products", async (req, res) => {
  try {
    const payload = req.body;
    const [productFound] = await pool.query(
      "select * from products where name=?",
      [payload.name]
    );

    if (productFound.length > 0) {
      return res
        .status(400)
        .json({ message: "product with same name is still there" });
    }

    await pool.query(
      "INSERT  into products (name,stock,price) values (?,?,?)",
      [payload.name, payload.stock, payload.price]
    );

    return res.status(200).json({ message: "product is succefully created" });
  } catch (e) {
    console.log(e);

    return res.status(500).json({ message: "an error occured" });
  }
});

router.patch("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [product] = await pool.query("select * from products where id=?", [
      id,
    ]);
    if (product.length == 0) {
      return res.status(404).json({ message: "product not found" });
    }
    const [theProduct] = product;
    const currentStock = theProduct.stock;
    const updatedStock = currentStock - 1;
    await pool.query("update products set stock=? where id=?", [
      updatedStock,
      id,
    ]);
    return res
      .status(200)
      .json({ message: "successfully updated the product stock" });
  } catch {
    return res.status(500).json({ message: "an error occured" });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [product] = await pool.query("select * from products where id=?", [
      id,
    ]);
    if (product.length == 0) {
      return res.status(404).json({ message: "product not found" });
    }

    await pool.query("delete from products where id=?", [id]);
    return res
      .status(200)
      .json({ message: "successfully deleted the product" });
  } catch {
    return res.status(500).json({ message: "an error occured" });
  }
});

module.exports = router;
