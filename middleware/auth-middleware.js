const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decodedTokenPayload = await jwt.verify(token, process.env.JWT_SECRET); //decryption
    if (decodedTokenPayload.email) {
      next();
    } else {
      return res.status(401).json({ message: "inavlid resource access" });
    }
  } catch {
    return res.status(401).json({ message: "inavlid resource access" });
  }
};
module.exports = authMiddleware;
