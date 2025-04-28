const { app, router, bcrypt, prisma, jwt } = require("../common/common");
const express = require("express");
const path = require("path");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const {
  deleteComment
} = require("../controllers/commentController");

function middleware(req, res, next) {
    if (req.headers?.authorization?.split(" ")[1]) {
      next();
    } else {
      res.send("Please log in again");
    }
  }
  
  router.delete("/users/:userId/comments/:commentId", middleware, deleteComment);

  
  module.exports = router;