const { empty } = require("@prisma/client/runtime/library");
const { prisma } = require("./common");

const createNewUser = async (email, hashedPassword) => {
  const response = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
  return response;
};

const getEmail = async (email) => {
  const response = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  return response;
};

const getAll = async () => {
  const response = await prisma.user.findMany();
  return response;
};

module.exports = { createNewUser, getEmail, getAll };