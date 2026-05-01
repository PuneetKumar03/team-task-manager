import { useEffect, useState } from "react";
import api from "../services/api";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { LayoutDashboard, CheckCircle2, Clock, AlertCircle, TrendingUp } from "lucide-react";

function Dashboard() {
  const [data, setData] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    activityLog: [] // Assuming your API provides trend data
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // CLEANER: No need to pass headers manually anymore thanks to our interceptor!
        const res = await api.get("/dashboard");
        setData(res.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { title: "Total Tasks", value: data.totalTasks, icon: <LayoutDashboard />, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Completed", value: data.completedTasks, icon: <CheckCircle2 />, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Pending", value: data.pendingTasks, icon: <Clock />, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Overdue", value: data.overdueTasks, icon: <AlertCircle />, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  if (loading) return <div className="p-8 text-slate-500 animate-pulse">Loading Analytics...</div>;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Analytics Overview</h1>
          <p className="text-slate-500 mt-1">Real-time performance metrics for your workspace.</p>
        </div>
        <div className="hidden md:flex gap-2">
          <button className="px-4 py-2 text-sm font-semibold bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50">Export PDF</button>
          <button className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700">Refresh Data</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                <TrendingUp size={12} /> +12%
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{stat.value || 0}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Area Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-w-0"> 
  <h3 className="text-lg font-bold text-slate-800 mb-6">Task Completion Trend</h3>
  <div className="h-80 w-full">
    <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.activityLog || []}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="tasks" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick List / Sidebar Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Urgent Actions</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="size-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">Finalize API Docs</p>
                  <p className="text-xs text-slate-500">Overdue by 2 days</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 text-sm font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
            View All Overdue
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;