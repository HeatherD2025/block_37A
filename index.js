const { PrismaClient } = require('./generated/prisma/client')

const prisma = new PrismaClient()

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

async function main() {
    await prisma.user.create({
      data: {

        username: 'Alice',
        password: '',
        posts: {
          create: { title: 'Hello World' },
        },
        profile: {
          create: { bio: 'I like turtles' },
        },
      },
    })
  
    const allUsers = await prisma.user.findMany({
      include: {
        posts: true,
        profile: true,
      },
    })
    console.dir(allUsers, { depth: null })
  }

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })