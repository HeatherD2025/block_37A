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

    const user1 = await prisma.user.create({
      data: {
        username: "Test1",
        password: hashedPassword,
      },
    });
    const token1 = jwt.sign(
      { id: user1.id, username: user1.username },
      WEB_TOKEN,
      {
        expiresIn: "7d",
      }
    );

    const user2 = await prisma.user.create({
      data: {
        username: "Test2",
        password: hashedPassword,
      },
    });
    const token2 = jwt.sign(
      { id: user2.id, username: user2.username },
      WEB_TOKEN,
      {
        expiresIn: "7d",
      }
    );

    const user3 = await prisma.user.create({
      data: {
        username: "Test3",
        password: hashedPassword,
      },
    });
    const token3 = jwt.sign(
      { id: user3.id, username: user3.username },
      WEB_TOKEN,
      {
        expiresIn: "7d",
      }
    );

    console.log("Generated JWT token for seeded user1:");
    console.log(token1);

    console.log("Generated JWT token for seeded user2:");
    console.log(token2);

    console.log("Generated JWT token for seeded user3:");
    console.log(token3);

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
