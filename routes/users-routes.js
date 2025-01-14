const express = require("express");
const pool = require("../utilities/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const router = express.Router();
require("dotenv").config();

router.get(
  "/", //users/

  async (req, res) => {
    try {
      const [users] = await pool.query("select * from users");

      return res.status(200).json({
        data: users,
        message: "successfully users are fetched",
      });
    } catch {
      return res.status(500).send("an error has occured!");
    }
  }
);

router.get("/:email", async (req, res) => {
  try {
    //users/:email
    const email = req.params.email;
    const [userResp] = await pool.query("select * from users where email=?", [
      email,
    ]);
    if (userResp.length > 0) {
      return res.status(200).json({
        data: userResp,
        message: "successfully user is fetched",
      });
    } else {
      return res.status(404).json({
        message: "user not found",
      });
    }
  } catch {
    return res.status(500).send("an error has occured!");
  }
});

router.post("/", async (req, res) => {
  const payload = req.body;
  try {
    const [findUser] = await pool.query("select * from users where email=?", [
      payload.email,
    ]);

    if (findUser.length > 0) {
      return res.status(400).json({
        message: "user is already there please try with different email",
      });
    }
    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const [createReposne] = await pool.query(
      "insert into users(name,email,password) values (?,?,?)",
      [payload.name, payload.email, hashedPassword]
    );
    if (createReposne.affectedRows == 1) {
      return res.status(200).json({
        message: "user has been created successfully",
      });
    } else {
      return res.status(200).json({
        message: "request was succefull but user not created",
      });
    }
  } catch {
    return res.status(500).json({ message: "an error occured" });
  }
});

router.put("/:id", async (req, res) => {
  const payload = req.body;
  const id = req.params.id;

  try {
    const [userFound, ...fields] = await pool.query(
      "select * from users where id=?",
      [id]
    );
    if (userFound.length == 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const [updateResponse, ...fields2] = await pool.query(
      "update users set name=?,email=?,password=? where id=?",
      [payload.name, payload.email, payload.password, id]
    );

    if (updateResponse.affectedRows === 1) {
      return res.status(200).json({ message: "user successfully updated" });
    } else {
      return res
        .status(200)
        .json({ message: "request success, user not updated" });
    }
  } catch (e) {
    return res.status(500).json({
      message: "an internal sever error occured. please try again",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const userFound = await pool.query("select * from users where id=?", [id]);

    if (userFound[0].length == 0) {
      return res.status(404).json({ message: "user not found" });
    }

    const delResponse = await pool.query("delete from users where id=?", [id]);

    if (delResponse[0].affectedRows === 1) {
      return res.status(200).json({ message: "user successfully deleted" });
    } else {
      return res
        .status(200)
        .json({ message: "request success, user not deleted" });
    }
  } catch {
    return res
      .status(500)
      .json({ message: "an internal sever error occured. please try again" });
  }
});

module.exports = router;
