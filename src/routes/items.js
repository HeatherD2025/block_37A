const { router, bcrypt, prisma, jwt } = require("../common/common");
const express = require("express");
const app = express();
const path = require("path");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const {
 getAllItems,
 getItem,
 getItemReviews,
} = require("../controllers/itemController");

router.get("/", getAllItems);
router.get("/:itemId", getItem);
router.get("/:itemId/reviews", getItemReviews);

 module.exports = router;
