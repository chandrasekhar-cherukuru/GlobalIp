import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password || !role) {
      alert("Please fill in all fields!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/login", {
        email,
        password
      });

      console.log("Login response:", response.data);
      const { accessToken, username, email: userEmail, role: userRole } = response.data;
      
      localStorage.setItem("token", accessToken);
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("role", userRole);
      localStorage.setItem("user", JSON.stringify({ username, email: userEmail, role: userRole }));

      if (userRole === "ADMIN") navigate("/admindashboard");
      else if (userRole === "ANALYST") navigate("/analystdashboard");
      else navigate("/userdashboard");
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response);
      const errorMsg = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || "Login failed. Please check your credentials.";
      alert(`Login failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend OAuth2 endpoint
    window.location.href = "http://localhost:8080/oauth2/authorize/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-white to-yellow-200 p-6">
      <div className="w-[900px] bg-white/80 rounded-3xl shadow-2xl border border-yellow-300 overflow-hidden flex transition-all duration-500 hover:shadow-[0_8px_40px_rgba(220,180,20,0.35)]">
        
        <div className="w-1/2 bg-gradient-to-br from-yellow-300 to-yellow-200 p-10 flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold text-yellow-800 drop-shadow-lg">
            Welcome Back!
          </h1>
          <p className="text-gray-700 mt-3 mb-6 font-medium">
           
          </p>

          <img
            src="https://img.freepik.com/premium-vector/woman-is-working-desktop-with-laptop-freelance-online-education-web-surfing-office-worker-vector-illustration-cartoon-style_562639-650.jpg"
            className="rounded-xl shadow-xl border border-yellow-300"
            alt=""
          />
        </div>

        <form
          onSubmit={handleLogin}
          className="w-1/2 p-10 flex flex-col justify-center gap-4"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Login
          </h2>

          <div>
            <label className="text-sm text-gray-600 font-semibold">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 mt-1 border border-yellow-300 rounded-lg bg-yellow-50 w-full focus:ring-2 ring-yellow-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 font-semibold">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="p-3 mt-1 border border-yellow-300 rounded-lg bg-yellow-50 w-full focus:ring-2 ring-yellow-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 font-semibold">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="p-3 mt-1 border border-yellow-300 rounded-lg bg-yellow-50 focus:ring-2 ring-yellow-400 w-full"
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="analyst">Analyst</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-semibold shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="flex items-center gap-3 my-2">
            <hr className="flex-1 border-gray-300" />
            <span className="text-gray-500 text-sm">OR</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold shadow hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-700">
            Don't have an account?{' '}
            <span
              className="text-yellow-700 font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
