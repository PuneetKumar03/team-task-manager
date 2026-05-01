const prisma = require("../utils/prisma");

const getDashboard = async (req, res) => {
  try {
    const totalTasks = await prisma.task.count();

    const completedTasks = await prisma.task.count({
      where: {
        status: "COMPLETED"
      }
    });

    const pendingTasks = await prisma.task.count({
      where: {
        status: {
          in: ["TODO", "IN_PROGRESS"]
        }
      }
    });

    const overdueTasks = await prisma.task.count({
      where: {
        dueDate: {
          lt: new Date()
        },
        status: {
          not: "COMPLETED"
        }
      }
    });

    // fetch all tasks
    const tasks = await prisma.task.findMany({
      select: {
        createdAt: true
      }
    });

    // group by weekday
    const dayMap = {
      Sun: 0,
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0
    };

    tasks.forEach((task) => {
      const day = new Date(task.createdAt).toLocaleDateString(
        "en-US",
        { weekday: "short" }
      );

      dayMap[day]++;
    });

    const activityLog = Object.entries(dayMap).map(
      ([name, count]) => ({
        name,
        tasks: count
      })
    );

    res.status(200).json({
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      activityLog
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getDashboard
};