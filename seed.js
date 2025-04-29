const bcrypt = require("bcrypt");
const { prisma } = require("./src/common/common.js");

async function main() {
  try {
    // Create users
    console.log("seeding started"); // Start seeding process

    const saltRounds = 10; // Define the number of salt rounds for hashing
    const hashedPassword1 = await bcrypt.hash("password1", saltRounds); // Hash password for user1
    const hashedPassword2 = await bcrypt.hash("password2", saltRounds); // Hash password for user2

    const user1 = await prisma.user.create({
      data: {
        username: "testuser1",
        password: hashedPassword1,
      },
    });
    console.log("seeding user1"); // Create user1

    const user2 = await prisma.user.create({
      data: {
        username: "testuser2",
        password: hashedPassword2,
      },
    });
    console.log("seeding user2"); // Create user2

    // Create items
    const item1 = await prisma.item.create({
      data: {
        name: "Grilled Cheese",
      },
    });

    const item2 = await prisma.item.create({
      data: {
        name: "Ham & Cheese",
      },
    });

    const item3 = await prisma.item.create({
      data: {
        name: "Meatball Sub",
      },
    });

    const item4 = await prisma.item.create({
      data: {
        name: "Philly Cheesesteak",
      },
    });

    const item5 = await prisma.item.create({
      data: {
        name: "Veggie",
      },
    });

    console.log("Items created"); // Create items

    // Create reviews
    const review1 = await prisma.review.create({
      data: {
        rating: 5,
        user: { connect: { id: user1.id } },
        item: { connect: { id: item1.id } },
      },
    });

    const review2 = await prisma.review.create({
      data: {
        rating: 3,
        user: { connect: { id: user2.id } },
        item: { connect: { id: item3.id } },
      },
    });

    const review3 = await prisma.review.create({
      data: {
        rating: 1,
        user: { connect: { id: user2.id } },
        item: { connect: { id: item5.id } },
      },
    });

    console.log("Reviews created"); // Create reviews

    // Create comments
    await prisma.comment.create({
      data: {
        text: "Great sandwich!",
        user: { connect: { id: user1.id } },
        review: { connect: { id: review1.id } },
      },
    });

    await prisma.comment.create({
      data: {
        text: "What am I, a rabbit?",
        user: { connect: { id: user2.id } },
        review: { connect: { id: review3.id } },
      },
    });

    console.log("Comments created"); // Create comments
    console.log("Seeding completed!");
  } catch (error) {
    console.error("Seeding failed:", error);
    throw error;
  }
}

// Call the main function to seed the database
// and handle any errors that occur
main()
  .catch((er) => {
    console.error(er);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect()
  });

module.exports = main; // Export the main function to be used in other parts of the application
