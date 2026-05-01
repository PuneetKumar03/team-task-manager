import { useEffect, useState } from "react";
import api from "../services/api";
import { FolderKanban, Plus, UserPlus } from "lucide-react";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [selectedUser, setSelectedUser] = useState("");
  const [selectedProject, setSelectedProject] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch all members
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Create project
  const createProject = async () => {
    try {
      await api.post("/projects", {
        title,
        description
      });

      setTitle("");
      setDescription("");

      fetchProjects();
    } catch (error) {
      console.log(error);
    }
  };

  // Add member to project
  const addMember = async () => {
    try {
      await api.post("/projects/add-member", {
        userId: Number(selectedUser),
        projectId: Number(selectedProject)
      });

      alert("Member added successfully");

      setSelectedUser("");
      setSelectedProject("");

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchProjects();
      await fetchUsers();
    };

    loadData();
  }, []);

return (
    <div className="w-full max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Projects
        </h1>
      </div>

      {/* Admin Section */}
      {user?.role === "ADMIN" && (
        <>
          {/* Create Project */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4">
              Create Project
            </h2>

            <input
              type="text"
              placeholder="Project title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full border p-3 rounded-lg mb-4"
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full border p-3 rounded-lg mb-4"
            />

            <button
              onClick={createProject}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl"
            >
              <Plus size={18} />
              Create Project
            </button>
          </div>

          {/* Add Member */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4">
              Add Member To Project
            </h2>

            {/* Member Dropdown */}
            <select
              value={selectedUser}
              onChange={(e) =>
                setSelectedUser(e.target.value)
              }
              className="w-full border p-3 rounded-lg mb-4"
            >
              <option value="">
                Select Member
              </option>

              {users.map((user) => (
                <option
                  key={user.id}
                  value={user.id}
                >
                  {user.name}
                </option>
              ))}
            </select>

            {/* Project Dropdown */}
            <select
              value={selectedProject}
              onChange={(e) =>
                setSelectedProject(e.target.value)
              }
              className="w-full border p-3 rounded-lg mb-4"
            >
              <option value="">
                Select Project
              </option>

              {projects.map((project) => (
                <option
                  key={project.id}
                  value={project.id}
                >
                  {project.title}
                </option>
              ))}
            </select>

            <button
              onClick={addMember}
              className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl"
            >
              <UserPlus size={18} />
              Add Member
            </button>
          </div>
        </>
      )}

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white p-6 rounded-2xl shadow"
          >
            <FolderKanban
              className="text-blue-600 mb-4"
              size={30}
            />

            <h2 className="text-xl font-semibold mb-2">
              {project.title}
            </h2>

            <p className="text-slate-500">
              {project.description}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Projects;