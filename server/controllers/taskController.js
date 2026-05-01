const prisma = require("../utils/prisma");

const createTask = async (req, res) => {
  try {
    // 1. Check if user is ADMIN
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Only admin can create tasks"
      });
    }

    // 2. Extract variables from req.body first
    const {
      title,
      description,
      assignedTo,
      projectId,
      dueDate
    } = req.body;

    // 3. Convert assignedTo and projectId to Number
    const assignedToNum = Number(assignedTo);
    const projectIdNum = Number(projectId);

    // 4. Validate that the assigned member belongs to the project
    const memberExists = await prisma.projectMember.findFirst({
      where: {
        projectId: projectIdNum,
        userId: assignedToNum
      }
    });

    if (!memberExists) {
      return res.status(400).json({
        message: "User is not a member of this project"
      });
    }

    // 5. Create task with converted Numbers and optional dueDate
    const task = await prisma.task.create({
      data: {
        title,
        description,
        assignedTo: assignedToNum,
        projectId: projectIdNum,
        dueDate: dueDate ? new Date(dueDate) : null
      }
    });

    // 6. Return 201 on successful creation
    return res.status(201).json(task);

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};
const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const projectIdNum = Number(projectId);

    // Validate project membership for non-admin users
    if (req.user.role !== "ADMIN") {
      const memberExists = await prisma.projectMember.findFirst({
        where: {
          projectId: projectIdNum,
          userId: req.user.id
        }
      });

      if (!memberExists) {
        return res.status(400).json({
          message: "You are not a member of this project"
        });
      }
    }

    let tasks;

    // Admin sees all tasks of a project
    if (req.user.role === "ADMIN") {
      tasks = await prisma.task.findMany({
        where: {
          projectId: projectIdNum
        },
        include: {
          user: true,
          project: true
        }
      });
    }

    // Member sees only assigned tasks
    else {
      tasks = await prisma.task.findMany({
        where: {
          projectId: projectIdNum,
          assignedTo: req.user.id
        },
        include: {
          user: true,
          project: true
        }
      });
    }

    return res.status(200).json(tasks);

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};
const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await prisma.task.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    // Only admin or assigned member can update
    if (
      req.user.role !== "ADMIN" &&
      task.assignedTo !== req.user.id
    ) {
      return res.status(403).json({
        message: "Not allowed"
      });
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: Number(id)
      },
      data: {
        status
      }
    });
    
    res.status(200).json(updatedTask);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
module.exports = {
  createTask,
  getTasksByProject,
  updateTaskStatus
};