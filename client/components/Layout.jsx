import {
  Outlet,
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  LogOut
} from "lucide-react";

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = (() => {
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (err) {
      console.warn("Invalid user data in localStorage:", err);
      return null;
    }
  })();

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard
    },
    {
      name: "Projects",
      path: "/projects",
      icon: FolderKanban
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: ListTodo
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="h-screen flex bg-slate-50 overflow-hidden">

      {/* Sidebar */}
      <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col justify-between shrink-0">

        {/* Top */}
        <div>
          <div className="p-6">
            <h1 className="text-3xl font-bold text-blue-600">
              TASKLY
            </h1>

            <p className="text-sm text-slate-400 mt-1">
              WORKSPACE
            </p>
          </div>

          <nav className="px-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                    location.pathname === item.path
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={20} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom */}
        <div className="p-4 border-t border-slate-200 mb-4">
          <div className="mb-4">
            <p className="font-semibold text-slate-800">
              {user?.name || "User"}
            </p>

            <p className="text-sm text-slate-400">
              {user?.role || "Member"}
            </p>
          </div>

         <button
  onClick={handleLogout}
  className="w-full flex items-center gap-2 justify-center px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-md transition duration-200"
>
  <LogOut size={18} className="text-white" />
  <span>Logout</span>
</button>
        </div>

      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <main className="flex-1 overflow-y-scroll p-8">
          <Outlet />
        </main>
      </div>

    </div>
  );
}

export default Layout;