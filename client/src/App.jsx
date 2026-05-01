import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";

// 1. Lazy load pages to reduce initial bundle size
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Projects = lazy(() => import("./pages/Projects"));
const Tasks = lazy(() => import("./pages/Tasks"));

// Layout and Guards (Usually kept as standard imports or lazy loaded)
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";

// Loading Fallback (A branded, professional spinner)
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-[#F8FAFC]">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
  </div>
);

function App() {
  return (
    /* Suspense is required when using lazy components */
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <Navigate
              to={localStorage.getItem("token") ? "/dashboard" : "/login"}
              replace
            />
          }
        />

        {/* Private App Shell */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="tasks" element={<Tasks />} />
          
        </Route>

        {/* 404 Catch-all */}
        <Route path="*" element={
          <div className="flex h-screen flex-col items-center justify-center">
            <h1 className="text-4xl font-bold">404</h1>
            <p className="text-slate-500">Page not found</p>
          </div>
        } />
      </Routes>
    </Suspense>
  );
}

export default App;