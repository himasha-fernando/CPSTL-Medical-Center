import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { jwtDecode } from "jwt-decode";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

// LoginCard component
const LoginCard = ({ children }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
      <div className="flex flex-col items-center mb-6">
        <img
          src="/cpstl.png"
          alt="Company Logo"
          className="w-24 h-24 mb-4 rounded-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/96x96/cccccc/333333?text=Logo";
          }}
        />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
        <p className="text-gray-600">Sign in to your account</p>
      </div>
      {children}
    </div>
  );
};

// LoginForm component
const LoginForm = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

    const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!username || !password) {
      setMessage("Please enter both username and password.");
      setLoading(false);
      return;
    }

     try {
    // admin login first
    let response;
    try {
      response = await api.post(
  "/auth/admin/login",
  { username, password }
);
    } catch (adminError) {
      //patient login
      response = await api.post(
        "/auth/patient/login",
        { username, password }
      );
      
    }

    const data = response.data;
    console.log("Login response:", data);

      if (data.token) {
        // Save JWT token and role
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role || "user");

        // Decode JWT to get user id
        let decoded;
        try {
          decoded = jwtDecode(data.token);
        } catch (err) {
          console.error("Error decoding token:", err);
          setMessage("Login failed: invalid token");
          setLoading(false);
          return;
        }

        const userId = decoded.id;
        localStorage.setItem("userId", userId);

        // Save full user object
        localStorage.setItem("userData", JSON.stringify(data.user));

        setMessage("Login successful!");

        // Navigate based on role
        if (data.role === "admin") navigate("/Dashboard");
        else if (data.role === "patient" || data.role === "staff")
          navigate("/UserDashboard");
        else navigate("/");
      } else {
        setMessage(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message || "Login failed.");
      } else {
        setMessage("An error occurred. Please try again later.");
      }
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          User name
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Enter your username"
          required
        />
      </div>

      <div className="relative">
  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
    Password
  </label>
  <input
    type={showPassword ? "text" : "password"}
    id="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
    placeholder="Enter your password"
    required
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute top-8 right-3 text-gray-500 hover:text-gray-700"
  >
    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
  </button>
</div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-gray-900"
          >
            Remember me
          </label>
        </div>
      </div>

      {message && (
        <div
          className={`text-sm p-3 rounded-md ${
            message.includes("successful")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <>
              <svg
                className="h-5 w-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              Sign In
            </>
          )}
        </button>
      </div>
    </form>
  );
};

// Main Login page component
function Login() {
  const navigate = useNavigate();

  const handleLoginSuccess = (token) => {
    if (token) {
      localStorage.setItem("userToken", token);
    }
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6">
      <LoginCard>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </LoginCard>
    </div>
  );
}

export default Login;
