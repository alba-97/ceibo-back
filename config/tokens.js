require("dotenv").config();

const secret = process.env.JWT_SECRET;

const jwt = require("jsonwebtoken");

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
    console.log("vengo de cofig", error);
  }
}

module.exports = { generateToken, validateToken };
