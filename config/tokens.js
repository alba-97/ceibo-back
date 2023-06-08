const jwt = require("jsonwebtoken");

require("dotenv").config();
const secret = process.env.JWT_SECRET;

function generateToken(payload) {
  const token = jwt.sign({ payload }, secret, {
    expiresIn: "2h",
  });
  return token;
}

function validateToken(token) {
  try {
    const verifiedToken = jwt.verify(token.split(" ")[1], secret);
    if (!verifiedToken) return "No valida token";
    return verifiedToken;
  } catch (error) {
    return "vengo de config", error;
  }
}

module.exports = { generateToken, validateToken };
