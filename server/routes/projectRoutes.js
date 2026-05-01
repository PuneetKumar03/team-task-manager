const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  createProject,
  getProjects,
  addMember
} = require("../controllers/projectController");

const router = express.Router();
router.post(
  "/add-member",
  authMiddleware,
  roleMiddleware("ADMIN"),
  addMember
);
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createProject
);
router.get("/", authMiddleware, getProjects);


module.exports = router;