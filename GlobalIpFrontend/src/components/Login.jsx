import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lightbulb, Mail, Lock, Eye, EyeOff, ArrowRight, Search, BarChart3, Globe, Shield } from 'lucide-react';
import { VscGithub } from 'react-icons/vsc';
import axios from "../api/axios";
import Toast from "./Toast";
import { useTheme } from '../context/ThemeContext';
import DarkModeToggle from './DarkModeToggle';

export default function Login() {
  const navigate = useNavigate();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!emailOrUsername || !password) {
      setToast({ message: "Please fill in all fields!", type: "error" });
      return;
    }

    if (password.length < 8) {
      setToast({ message: "Password must be at least 8 characters!", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/login", {
        email: emailOrUsername,
        password
      });

      console.log("Login response:", response.data);
      const { accessToken, username, email: userEmail, role: userRole } = response.data;
      
      localStorage.setItem("token", accessToken);
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("role", userRole);
      localStorage.setItem("user", JSON.stringify({ username, email: userEmail, role: userRole }));

      setToast({ message: "Login successful! Redirecting...", type: "success" });

      setTimeout(() => {
        if (userRole === "ADMIN") navigate("/admindashboard");
        else if (userRole === "ANALYST") navigate("/analystdashboard");
        else navigate("/userdashboard");
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response);
      
      let errorMsg;
      if (error.message === 'Network Error' || !error.response) {
        errorMsg = "Invalid credentials. Please check your email and password.";
      } else {
        errorMsg = error.response?.data?.message 
          || error.response?.data?.error 
          || "Login failed. Please check your credentials.";
      }
      
      setToast({ message: errorMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend OAuth2 endpoint
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8 animate-slide-in-left">
          <div className="space-y-4">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center space-x-3 mb-6 group cursor-pointer"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  GlobalIP
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Intelligence Platform</p>
              </div>
            </button>
            
            <h2 className="text-5xl font-light text-gray-900 dark:text-white leading-tight">
              Welcome Back to
              <span className="block text-primary-600 dark:text-primary-400">Your IP Hub</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Monitor global patents, track competitors, and gain strategic insights across 150+ countries.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: <Search className="w-6 h-6" />, text: 'Advanced IP Search & Analytics' },
              { icon: <BarChart3 className="w-6 h-6" />, text: 'Real-Time Filing Alerts' },
              { icon: <Globe className="w-6 h-6" />, text: 'Global Database Integration' },
              { icon: <Shield className="w-6 h-6" />, text: 'Enterprise-Grade Security' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center space-x-4 p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-primary-200 dark:border-primary-800 hover:border-primary-400 dark:hover:border-primary-600 transition-colors">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white">
                  {item.icon}
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-8 pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">10M+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Patents</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">150+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">99.9%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="animate-slide-in-right">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 sm:p-12">
            <div className="absolute top-8 right-8">
              <DarkModeToggle />
            </div>
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center space-x-3 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Lightbulb className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">GlobalIP</h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Intelligence Platform</p>
                </div>
              </button>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-2">
                Sign In
              </h2>
              <p className="text-gray-600 dark:text-gray-400">Access your IP intelligence dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                  Email or Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your email or username"
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/50 transition-all outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-14 py-3.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/50 transition-all outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-primary-600 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 dark:focus:ring-primary-400" />
                  <span className="ml-2 text-gray-600 dark:text-gray-400">Remember me</span>
                </label>
                <button type="button" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center space-x-3 py-3.5 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold text-gray-700 shadow-sm hover:shadow"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <p className="text-center text-gray-600 mt-6">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="text-primary-600 font-bold hover:text-primary-700 hover:underline transition-colors"
                >
                  Sign Up
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}