import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaRegEnvelope, FaLock, FaCircleNotch } from "react-icons/fa";
import api from "../services/api";


// 1. HELPER COMPONENT (Outside)
const InputField = ({ icon: Icon, type, name, placeholder, value, onChange, autoComplete, autoFocus }) => (
  <div className="relative mb-5 group">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
      <Icon className="w-5 h-5" />
    </div>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      aria-label={placeholder}
      className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all text-slate-900"
      required
    />
  </div>
);

// 2. MAIN COMPONENT
function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      const { token, user } = res.data;

      if (!token) {
        throw new Error("Login failed: no auth token returned.");
      }

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify(user ?? { email: form.email })
      );

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      alert(err?.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <form onSubmit={handleLogin} className="w-full max-w-md p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold mb-8 text-center">Sign In</h2>
        
        {/* USAGE: Ensure this matches the name above */}
        <InputField 
          icon={FaRegEnvelope} 
          type="email" 
          name="email" 
          placeholder="Email Address" 
          value={form.email}
          autoComplete="email"
          autoFocus
          onChange={(e) => setForm((prevForm) => ({ ...prevForm, email: e.target.value }))}
        />
        
        <InputField 
          icon={FaLock} 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={form.password}
          autoComplete="current-password"
          onChange={(e) => setForm((prevForm) => ({ ...prevForm, password: e.target.value }))}
        />


<button
  type="submit"
  disabled={loading}
  className={`w-full flex items-center justify-center gap-3 bg-blue-600 text-white font-semibold p-4 rounded-xl 
    transition-all duration-150 hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 active:scale-[0.98]
    ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
>
  {loading ? (
    <>
      {/* This uses the imported icon and applies the spinning animation */}
      <FaCircleNotch className="animate-spin w-5 h-5" />
      Authenticating...
    </>
  ) : (
    "Sign In"
  )}
</button>
      <p className="mt-4 text-center">
  Don't have an account?{" "}
  <Link to="/register" className="text-blue-600">
    Register
  </Link>
</p>
      </form>
    </div>
  );
}

export default Login;