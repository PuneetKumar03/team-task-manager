const prisma = require("../utils/prisma");

const createProject = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
  return res.status(403).json({
    message: "Only admin can create projects"
  });
}
    const { title, description } = req.body;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        createdBy: req.user.id
      }
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getProjects = async (req, res) => {
  try {
    let projects;

    if (req.user.role === "ADMIN") {
      projects = await prisma.project.findMany({
        include: {
          members: true,
          tasks: true
        }
      });
    } else {
      projects = await prisma.project.findMany({
        where: {
          members: {
            some: {
              userId: req.user.id
            }
          }
        },
        include: {
          members: true,
          tasks: true
        }
      });
    }

    res.status(200).json(projects);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
const addMember = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Only admin can add members"
      });
    }

    const { userId, projectId } = req.body;

    const member = await prisma.projectMember.create({
      data: {
        userId,
        projectId
      }
    });

    res.status(201).json(member);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
module.exports = {
  createProject,
  getProjects,
  addMember
};