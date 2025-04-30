const express = require("express");
const router = express.Router();
//importing methods from controller
const {
  getSandwichReview,
  createSandwichReview,
  getItemReviewDetails,
  getMySandwichReviews,
  updateSandwichReview,
  deleteSandwichReview,
} = require("../controllers/reviewController");
const { get } = require("http");
// const { isLoggedIn } = require("");

//route for get item review by item ID and review ID
router.get("/items/:itemId/review/:reviewId", getSandwichReview);

//route for creating a new sandwich review
router.post("/items/:itemId/reviews", createSandwichReview);

//route for getting all reviews of a particular item
router.get("/items/:itemId/reviews", getItemReviewDetails);

//route for getting all reviews of a particular user
router.get("/reviews/me", getMySandwichReviews);

//route for updating a review
router.put("/users/:userId/reviews/:reviewId", updateSandwichReview);

//route for deleting a review
router.delete("/users/:userId/reviews/:reviewId", deleteSandwichReview);

module.exports = router;
