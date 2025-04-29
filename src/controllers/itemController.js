const { router, bcrypt, prisma, jwt } = require("../common/common");

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

module.exports = {
  getAllItems,
};
