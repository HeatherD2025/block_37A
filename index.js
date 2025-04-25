const { PrismaClient } = require('./generated/prisma/client')
const express = require("express");
const app = express();
const path = require("path");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const prisma = new PrismaClient()
const PORT = 3000

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal server error.");
});


const authRoutes = require("./auth")
app.use("/auth", authRoutes);


app.use((req, res) => {
  res.status(404).send("Not found.");
});
// async function main() {
//     await prisma.user.create({
//       data: {

//         username: 'Alice',
//         password: '',
//         posts: {
//           create: { title: 'Hello World' },
//         },
//         profile: {
//           create: { bio: 'I like turtles' },
//         },
//       },
//     })
  
//     const allUsers = await prisma.user.findMany({
//       include: {
//         posts: true,
//         profile: true,
//       },
//     })
//     console.dir(allUsers, { depth: null })
//   }

// main()
//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })