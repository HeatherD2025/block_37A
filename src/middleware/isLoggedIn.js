const express = require("express");
const app = express();
app.use(express.json());
app.use(require("morgan")("dev"));
const bcrypt = require("bcrypt");
const JWT_SECRET = process.env.JWT_SECRET || "1234";
const jwt = require("jsonwebtoken");
const PORT = 3000;

const { createNewUser, getEmail, getAll } = require("./db");


const isLoggedIn = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.slice(7);
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    req.userId = id;
    next();
  } catch (error) {
    next(error);
  }
};

app.get("/", (req, res) => {
  res.json({ message: "This works" });
});

const setToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "8h" });
};

module.exports = {isLoggedIn, setToken}