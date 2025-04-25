const express = require("express");
const app = express();
app.use(express.json());
app.use(require("morgan")("dev"));
const bcrypt = require("bcrypt");
const JWT_SECRET = process.env.JWT_SECRET || "1234";
const jwt = require("jsonwebtoken");
const PORT = 3000;

const { createNewUser, getEmail, getAll } = require("./db");

app.listen(PORT, () => {
  console.log(`I am listening on port number ${PORT}`);
});

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

app.post("/api/auth/register", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const response = await createNewUser(email, hashedPassword);
    const token = setToken(response.id);
    res.status(201).json(token);
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const customer = await getEmail(email);
    const match = await bcrypt.compare(password, customer.password);
    if (match) {
      const token = setToken(customer.id);
      res.status(200).json(token);
    } else {
      res.status(403).json({ message: "The email and password do not match" });
    }
  } catch (error) {
    next(error);
  }
});

app.get("/getAll", isLoggedIn, async (req, res, next) => {
  try {
    const response = await getAll();
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});