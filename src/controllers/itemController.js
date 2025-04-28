const { router, bcrypt, prisma, jwt } = require("../common/common");
require("dotenv").config();

const getAllItems = async (req, res) => {
  try {
    const item = await prisma.item.findMany();
    console.log("query result:", item);
    return res.status(200).json({ item });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      message: "Server error",
    });
  }
};

const getItemById = async (req, res) => {
  try {
    console.log("Prisma objects", prisma)
    const { itemId } = req.params;
    const item = await prisma.item.findUnique({
      where: { id: String(itemId) },
    });

    if (!item) {
        return res.status(404).json({
            statusCode: 404,
            message: "Item not found"
        });
    }

    console.log("query result:", item);
    return res.status(200).json({ item });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      message: "Server error",
    });
  }
};

const getItemReviews = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await prisma.item.findUnique({
      where: { id: String(itemId) },
      include: { reviews: true },
    });
    if (!item.reviews) {
        return res.status(404).json({
            statusCode: 404,
            message: "Reviews not found"
        });
    }

    return res.status(200).json({ item });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      message: "Server error",
    });
  }
};

const getReviewsById = async (req, res) => {
    try {
      console.log("Prisma objects", prisma)
      const { itemId } = req.params;
      const item = await prisma.item.findUnique({
        where: { id: String(itemId) },
        include: { reviews: true },
    });
    if (!item.reviews) {
        return res.status(404).json({
            statusCode: 404,
            message: "Reviews not found"
        });
    }
    if (!item) {
        return res.status(404).json({
            statusCode: 404,
            message: "Item not found"
          });
      }
  
      console.log("query result:", item);
      return res.status(200).json({ item });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        statusCode: 500,
        message: "Server error",
      });
    }
  };

module.exports = {
  getAllItems,
  getItemById,
  getItemReviews,
  getReviewsById
};
