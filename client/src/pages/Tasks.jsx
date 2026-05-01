import { useEffect, useState, useCallback, useMemo } from "react";
import api from "../services/api";
import { 
  Plus, Filter, Calendar, MoreVertical, 
  CheckCircle2, 
} from "lucide-react";

function Tasks() {
    const user = JSON.parse(localStorage.getItem("user"));
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]); // Assuming you have an endpoint for users
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    priority: "MEDIUM"
  });

  // Load context data (Projects/Users)
  useEffect(() => {
    const loadContext = async () => {
      try {
        const [projRes, userRes] = await Promise.all([
          api.get("/projects"),
          api.get("/users") 
        ]);
        setProjects(projRes.data);
        setUsers(userRes.data);
        if (projRes.data.length > 0) setSelectedProjectId(projRes.data[0].id);
      } catch (err) {
        console.error("Context load failed", err);
      }
    };
    loadContext();
  }, []);

  const fetchTasks = useCallback(async () => {
  if (!selectedProjectId) return;
  try {
    console.log("Selected project:", selectedProjectId);
    const res = await api.get(`/tasks/project/${selectedProjectId}`);
    setTasks(res.data);
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}, [selectedProjectId]);

useEffect(() => {
  // We define an internal function so the 'setLoading' call 
  // is clearly part of the async lifecycle.
  const loadInitialData = async () => {
    // We don't call setLoading(true) here because it's already true by default
    await fetchTasks();
    setLoading(false); // Update loading state only after the data is fetched
  };

  loadInitialData();
}, [fetchTasks]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tasks", {
        ...form,
        assignedTo: Number(form.assignedTo),
        projectId: Number(selectedProjectId)
      });
      setForm({ title: "", description: "", assignedTo: "", dueDate: "", priority: "MEDIUM" });
      setIsModalOpen(false);
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/tasks/${id}`, { status });
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredTasks = useMemo(() => {
    if (statusFilter === "ALL") return tasks;
    return tasks.filter(t => t.status === statusFilter);
  }, [tasks, statusFilter]);

  const getStatusBadge = (status) => {
    const styles = {
      TODO: "bg-slate-100 text-slate-700 border-slate-200",
      IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-100",
      COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-100"
    };
    return `px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status] || styles.TODO}`;
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tasks</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-slate-500">Active Project:</span>
            <select 
              className="text-sm font-bold text-blue-600 bg-transparent focus:outline-none cursor-pointer"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
        </div>
        
        {user?.role === "ADMIN" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-100 active:scale-95"
          >
            <Plus size={20} />
            Create Task
          </button>
        )}
      
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
          <Filter size={16} className="text-slate-400" />
          <select 
            className="bg-transparent text-sm font-semibold text-slate-600 focus:outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <div className="text-sm text-slate-400 ml-auto">
          Showing {filteredTasks.length} tasks
        </div>
      </div>
      
      

      {/* Task List / Table Area */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-slate-50 animate-pulse rounded-xl" />)}
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Task Detail</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Assignee</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Due Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="font-bold text-slate-900">{task.title}</div>
                      <div className="text-sm text-slate-500 line-clamp-1">{task.description}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <div className="size-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-bold uppercase">
                          {users.find(u => u.id === task.assignedTo)?.name.slice(0, 2) || "U"}
                        </div>
                        {users.find(u => u.id === task.assignedTo)?.name || `User ${task.assignedTo}`}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar size={14} />
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <select 
                        className={`${getStatusBadge(task.status)} cursor-pointer focus:outline-none`}
                        value={task.status}
                        onChange={(e) => updateStatus(task.id, e.target.value)}
                      >
                        <option value="TODO">TODO</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                      </select>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="p-2 text-slate-300 hover:text-slate-600"><MoreVertical size={18}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center">
            <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">All clear!</h3>
            <p className="text-slate-500">No tasks found in this category.</p>
          </div>
        )}
      </div>

      {/* Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <form onSubmit={handleCreateTask} className="bg-white w-full max-w-xl rounded-3xl p-8 shadow-2xl animate-fade-in-up">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Create New Task</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Task Title</label>
                <input 
                  required
                  className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 transition-all"
                  placeholder="What needs to be done?"
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                <textarea 
                  className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 transition-all"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Assignee</label>
                <select 
                  className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl"
                  value={form.assignedTo}
                  onChange={(e) => setForm({...form, assignedTo: e.target.value})}
                >
                  <option value="">Select User</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Due Date</label>
                <input 
                  type="date"
                  className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl"
                  value={form.dueDate}
                  onChange={(e) => setForm({...form, dueDate: e.target.value})}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-10">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
              <button type="submit" className="flex-1 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">Create Task</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Tasks;