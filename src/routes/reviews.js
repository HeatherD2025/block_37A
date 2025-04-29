const express = require("express");
const router = express.Router();
//importing methods from controller
const {
  getSandwichReview,
  createSandwichReview,
  getMySandwichReviews,
  updateSandwichReview,
} = require("../controllers/reviewController");
// const { isLoggedIn } = require("");

//route for get item review by item ID and review ID
router.get("/api/items/:itemId/review/:reviewId", getSandwichReview);
//route for creating a new sandwich review
router.post("/api/items/:itemId/reviews", createSandwichReview);
//route for getting all reviews of a particular user
router.get("/api/reviews/me", getMySandwichReviews);
//route for updating a review
router.put("/api/users/:userId/reviews/:reviewId", updateSandwichReview);

module.exports = router;
