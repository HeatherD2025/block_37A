const { router, bcrypt, prisma, jwt } = require("../common/common");

const { router, prisma } = require("../common/common");
const { isLoggedIn } = require("../middleware/isLoggedIn");

// Import the necessary modules and functions
const {
  createComment,
  getMyComments,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

// Define the routes for comments
// Create a new comment
router.post(
  "/items/:itemId/reviews/:reviewId/comments",
  isLoggedIn,
  createComment
);

// Get all comments for a specific review
router.get("/comments/me", isLoggedIn, getMyComments);

// Update a specific comment
router.put("/users/:userId/comments/:commentId", isLoggedIn, updateComment);

// Delete a specific comment
router.delete("/users/:userId/comments/:commentId", isLoggedIn, deleteComment);

module.exports = router; // Export the router to be used in other parts of the application
