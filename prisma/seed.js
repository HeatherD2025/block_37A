const { prisma } = require("../src/common/common.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const WEB_TOKEN = process.env.JWT_SECRET || "1234";

async function main() {
  try {
    const hashedPassword = await bcrypt.hash("password", 10);
    await prisma.item.create({
      data: {
        name: "Grilled Cheese",
      },
    });

    await prisma.item.create({
      data: {
        name: "Ham & Cheese",
      },
    });

    await prisma.item.create({
      data: {
        name: "Meatball Sub",
      },
    });

    await prisma.item.create({
      data: {
        name: "Philly Cheesesteak",
      },
    });

    await prisma.item.create({
      data: {
        name: "Veggie",
      },
    });

    await prisma.user.create({
      data: {
        username: "Tor",
        password: "Skaarva",
      },
    });

    const user = await prisma.user.create({
      data: {
        username: "Test1",
        password: hashedPassword,
      },
    });
    const token = jwt.sign(
      { id: user.id, username: user.username },
      WEB_TOKEN,
      {
        expiresIn: "7d",
      }
    );

    console.log("Generated JWT token for seeded user:");
    console.log(token);

    console.log("seeding completed");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

main()
  .catch((er) => {
    console.error(er);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

module.exports = main;
