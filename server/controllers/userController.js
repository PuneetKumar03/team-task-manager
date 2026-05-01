const prisma = require("../utils/prisma");

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: "MEMBER"
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getUsers
};