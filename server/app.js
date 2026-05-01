const express = require("express");
const cors = require("cors");
const projectRoutes = require("./routes/projectRoutes");
const app = express();
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");
app.use(
  cors({
   origin: [
  "http://localhost:5173",
  "https://your-vercel-domain.vercel.app"
]
  })
);

app.use(express.json());
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.get("/test", (req, res) => {
  res.json({ message: "working" });
});
app.get("/", (req, res) => {
  res.send("Server running");
});

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});