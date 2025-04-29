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
    res.json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ message: "Server error fetching review." });
  }
};

// Post (create) a new sandwich review
const createSandwichReview = async (req, res) => {
  const { itemId } = req.params;
  const { rating, text, userId } = req.body;
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
    const existingReview = await prisma.review.findFirst({
      where: { userId: authenticateUserId, itemId: itemId },
    });

    if (existingReview) {
      return res.status(400).json({
        error:
          "User already has submitted a review for this sandwich. To change it, please use the update function instead.",
      });
    }

    const newReview = await prisma.review.create({
      data: {
        rating,
        text,
        userId: authenticateUserId,
        itemId,
      },
    });

    //average prisma method
    const averageRating = await prisma.review.aggregate({
      where: {
        itemId: itemId,
      },
      _avg: {
        rating: true,
      },
    });

    res.status(201).json(newReview, averageRating);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Server error while creating review." });
  }
};
// Get method for all reviews posted by a certain user
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

//update a review
const updateSandwichReview = async (req, res, next) => {
  const { userId, reviewId } = req.params;
  const { rating, comments } = req.body;
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
        comments: {
          create: [{ text: comments }],
        },
      },
    });
    res.status(200).json(updatedReview);
  } catch (error) {
    console.error("Error updating review", error);
    res.status(500).json({ message: "Server error fetching your reviews" });
  }
};
module.exports = {
  getSandwichReview,
  createSandwichReview,
  getMySandwichReviews,
  updateSandwichReview,
};
