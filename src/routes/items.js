const { app, router, bcrypt, prisma, jwt } = require("../common/common");
const express = require("express");
const path = require("path");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const {
  getAllItems,
  getItemById,
  getItemReviews,
} = require("../controllers/itemController");

router.get("/api/items", getAllItems);
router.get("/api/items/:itemId", getItemById);
router.get("/api/items/:itemId/reviews", getItemReviews);

module.exports = router;
