const { prisma } = require("../src/common/common.js");

async function main() {
  try {
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
    console.log("seeding completed");
  } catch (error) {
    console.error(error);
    throw error
  }
}


main()
  .catch((er) => {
    console.error(er);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect()
  });

module.exports = main;