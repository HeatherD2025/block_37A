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
  getReviewsById
} = require("../controllers/itemController");

router.get("/", getAllItems);
router.get("/:itemId", getItemById);
router.get("/:itemId/reviews", getItemReviews);
router.get("/:itemId/reviews/:reviewId", getReviewsById)

module.exports = router;
