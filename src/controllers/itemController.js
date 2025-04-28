const { router, bcrypt, prisma, jwt } = require("../common/common");

const getAllItems = async (req, res, next) => {
  const response = await prisma.item.findMany();
  res.send({ response });
};
const getItem = async (req, res, next) => {
  const response = await prisma.item.findFirst({
    where: {
      id: req.params.itemId,
    },
  });
  res.send({ response });
};
const getItemReviews = async (req, res, next) => {
  const response = await prisma.review.findMany({
    where: {
      itemId: req.params.itemId,
    },
  });
  res.send({ response });
};

module.exports = {
  getAllItems,
  getItem,
  getItemReviews,
};
