const { router, bcrypt, prisma, jwt } = require("../common/common");
require("dotenv").config();
const SECRET = process.env.JWT_SECRET || "1234";

// Get a single sandwich review
const getSandwichReview = async (req, res) => {
  const { itemId, reviewId } = req.params;
  try {
    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        itemId: itemId,
      },
      include: {
        comments: true,
        user: true,
        item: true,
      },
    });
    if (!review) {
      return res.status(404).json({
        message: "The sandwich review you're looking for doesn't exist.",
      });
    }
    // Return the review with user and item details
    return res.status(200).json(review);
    
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ message: "Server error fetching review." });
  }
};

// Post (create) a new sandwich review
const createSandwichReview = async (req, res) => {
  const { itemId } = req.params;
  const { rating, text, userId } = req.body; // Allows for user to add a review with text
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token)
      return res.status(401).json({ message: "Authorization token required" });

    const decoded = jwt.verify(token, SECRET);
    const authenticateUserId = decoded.id;

    const item = await prisma.item.findUnique({
      where: { id: itemId },
    });
    console.log("Item found:", item);

    if (authenticateUserId !== userId) {
      return res.status(403).json({ message: "You shall not pass" });
    }

    const newReview = await prisma.review.create({ 
      data: {
        rating,
        text, // Allows for user to add a review with text
        userId,
        itemId,
      },
    });

    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Server error while creating review." });
  }
};

// Get all reviews for a specific user
const getMySandwichReviews = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token)
      return res.status(401).json({ message: "Authorization token required" });

    const decoded = jwt.verify(token, SECRET);
    const userId = decoded.id;

    const myReviews = await prisma.review.findMany({
      where: {
        userId: userId,
      },
      include: {
        item: true,
        comments: true,
      },
    });
    res.status(200).json(myReviews);
  } catch (error) {
    console.error("Error fetching user reviews", error);
    res.status(500).json({ message: "Server error fetching your reviews" });
  }
};

// Get all reviews + average rating for a specific item
const getItemReviewDetails = async (req, res) => {
  const { itemId } = req.params;
  try {
    const item = await prisma.review.findUnique({
      where: { id: itemId},
      include: {
        reviews: {
          include: {
            user: true,
            comments: true,
          },
        },
      },
  });

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  const ratings = item.reviews.map((review) => review.rating); // Extract ratings
  const averageRating = ratings.length // Check if there are ratings
    ? (ratings.reduce((acc, r) => acc + r, 0) / ratings.length).toFixed(1) // Calculate average by dividing sum by count
    : null; // Set to null if no ratings

  res.status(200).json({
    item: {
      id: item.id,
      name: item.name,
      averageRating: Number(averageRating), // Convert to number
      reviews: item.reviews 
    },
  });
  } catch (error) {
    console.error("Error fetching review rating:", error);
    res.status(500).json({ message: "Server error fetching review rating." });
  }
};

//update a review
const updateSandwichReview = async (req, res, next) => {
  const { userId, reviewId } = req.params;
  const { rating, text } = req.body; // Allows for user to update a review with text and rating
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token)
      return res.status(401).json({ message: "Authorization token required" });

    const decoded = jwt.verify(token, SECRET);
    const authenticatedUserId = decoded.id;

    if (authenticatedUserId !== userId) {
      return res
        .status(403)
        .json({ message: "You do not have permission to update this review." });
    }

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    if (review.userId !== userId) {
      return res.status(403).json({ message: "You do not own this review." });
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating,
        text,
      },
    });

    res.status(200).json(updatedReview);
  } catch (error) {
    console.error("Error updating review", error);
    res.status(500).json({ message: "Server error fetching your reviews" });
  }
};

// Delete a review
const deleteSandwichReview = async (req, res) => {
  const { userId, reviewId } = req.params;

  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Authorization token required" });
    }

  const decoded = jwt.verify(token, SECRET); // Decode the token
  const authenticatedUserId = decoded.id; // Get the user ID from the token

  if (authenticatedUserId !== userId) {
    return res
      .status(403)
      .json({ message: "You do not have permission to delete this review." });
  }

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  if (review.userId !== userId) {
    return res.status(403).json({ message: "You do not own this review." });
  }
  
  await prisma.review.delete({
    where: { id: reviewId },
  });

  res.status(204).send(); // No content to send back
} catch (error) {
    console.error("Error deleting review", error);
    res.status(500).json({ message: "Server error deleting review" });
  }
};

module.exports = {
  getSandwichReview,
  createSandwichReview,
  getItemReviewDetails,
  getMySandwichReviews,
  updateSandwichReview,
  deleteSandwichReview,
};
