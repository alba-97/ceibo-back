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
    return jwt.verify(token.split(" ")[1], secret);
  } catch (error) {
    console.log("error validate token", error);
  }
}

module.exports = { generateToken, validateToken };
