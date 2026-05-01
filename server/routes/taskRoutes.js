const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  createTask,
  getTasksByProject,
  updateTaskStatus
} = require("../controllers/taskController");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createTask
);
router.get(
  "/project/:projectId",
  authMiddleware,
  getTasksByProject
);
router.patch("/:id", authMiddleware, updateTaskStatus);

module.exports = router;