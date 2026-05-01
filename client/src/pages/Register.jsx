import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "MEMBER"
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/signup", form);
      navigate("/login");
    } catch (error) {
      console.error("Register error:", error);
      alert(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white shadow-lg p-8 rounded-xl w-96">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Register
        </h1>

        <form onSubmit={handleRegister}>
          <input
            className="w-full border p-3 mb-4 rounded-lg"
            placeholder="Name"
            value={form.name}
            autoComplete="name"
            onChange={(e) =>
              setForm((prevForm) => ({ ...prevForm, name: e.target.value }))
            }
          />

          <input
            className="w-full border p-3 mb-4 rounded-lg"
            placeholder="Email"
            value={form.email}
            autoComplete="email"
            onChange={(e) =>
              setForm((prevForm) => ({ ...prevForm, email: e.target.value }))
            }
          />

          <input
            className="w-full border p-3 mb-4 rounded-lg"
            type="password"
            placeholder="Password"
            value={form.password}
            autoComplete="new-password"
            onChange={(e) =>
              setForm((prevForm) => ({
                ...prevForm,
                password: e.target.value
              }))
            }
          />

        <select
          className="w-full border p-3 mb-4 rounded-lg"
          value={form.role}
          onChange={(e) =>
            setForm({
              ...form,
              role: e.target.value
            })
          }
        >
          <option value="MEMBER">MEMBER</option>
          <option value="ADMIN">ADMIN</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white p-3 rounded-lg transition-opacity ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"}`}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        </form>
      </div>
    </div>
  );
}

export default Register;