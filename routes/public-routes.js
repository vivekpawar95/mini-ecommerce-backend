const express = require("express");
const pool = require("../utilities/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const router = express.Router();
require("dotenv").config();

router.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const [userResp] = await pool.query("select * from users where email=?", [
      email,
    ]);

    if (userResp.length == 0) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    const isPassMatch = await bcrypt.compare(password, userResp[0].password);
    if (!isPassMatch) {
      return res.status(400).json({ message: "user password is incorrect" });
    }
    // //symmetric
    const token = await jwt.sign(userResp[0], process.env.JWT_SECRET, {
      expiresIn: "1h",
      algorithm: "HS256",
    }); //encryption

    // const privateKey = fs.readFileSync("certifications/private.cert");
    // const publicKey = fs.readFileSync("certifications/public.cert");

    // //Asymmetric
    // const token = await jwt.sign(userResp[0], privateKey, {
    //   expiresIn: "1h",
    //   algorithm: "RS256",
    // }); //encryption
    // const decodedTokenPayload = await jwt.verify(token, publicKey); //decryption
    // console.log("decodedTokenPayload: ", decodedTokenPayload);

    return res
      .status(200)
      .json({ message: "user logged in successfully", token: token });
  } catch {
    return res.status(500).send("an error has occured!");
  }
});
module.exports = router;
