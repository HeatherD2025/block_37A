const { router, bcrypt, prisma, jwt } = require("../common/common");
require("dotenv").config();

// const login = async (req, res) => {
//   const { username, password } = req.body;
//   const user = await prisma.user.findFirst({
//     where: {
//       username,
//     },
//   });
//   const match = await bcrypt.compare(password, user?.password);
//   if (match) {
//     const token = jwt.sign(
//       user.id,
//       process.env.WEB_TOKEN,
//     );
//     const obj = {
//       user,
//       token,
//     };
//     res.send(obj);
//   } else {
//     res.send("Something didn't work");
//   }
// };
const login = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await prisma.user.findFirst({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ 
        statusCode: 404, 
        message: "User not found" 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        statusCode: 401, 
        message: "Login denied" 
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.WEB_TOKEN,
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      statusCode: 500, 
      message: "Server error" 
    });
  }
};

const register = async (req, res) => {
  const { username, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const registerUser = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });
  if (registerUser) {
    const token = jwt.sign(
      registerUser.id,
      process.env.WEB_TOKEN,
    );
    const obj = {
      registerUser,
      token,
    };
    res.json(obj);
  } else {
    res.send("Something didn't work");
  }
};

const userGet = async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findFirst({
    where: {
      id,
    },
  });
  res.send(user);
};

module.exports = {
  login,
  register,
  userGet,
};
