const { router, bcrypt, prisma, jwt } = require("../common/common");
 const express = require("express");
 const app = express();
 const path = require("path");
 app.use(express.urlencoded({ extended: true }));
 app.use(express.json());
 const cors = require("cors");
 app.use(cors());
 
 const {
  login,
  register,
  userGet,
} = require("../controllers/authController");

function middleware(req, res, next) {
  if (req.headers?.authorization?.split(" ")[1]) {
    next();
  } else {
    res.send("Please log in again");
  }
}
 
router.post("/login", login);
router.post("/register", register);
router.get("/auth/me", middleware, userGet);

 module.exports = router;