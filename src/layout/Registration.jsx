import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import io from "socket.io-client";

const chatURL="https://chat-app-backend-2ph1.onrender.com/api"
// Initialize WebSocket connection
const socket = io("https://chat-app-backend-2ph1.onrender.com");

socket.on("connect", () => {
  console.log(`Connected to WebSocket server with ID: ${socket.id}`);
});

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteId = searchParams.get("invite");

  useEffect(() => {
    if (inviteId) {
      console.log("📌 Invite ID received in Register:", inviteId);
    }
  }, [inviteId]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
<<<<<<< HEAD
      // Update URL to match the backend route ("/api/auths/register")
      const response = await fetch(`${chatURL}/auths/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
=======
      const response = await fetch("http://localhost:5000/api/auths/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, inviteId }),
>>>>>>> 8c6e9f1 (first commit)
      });

      const responseText = await response.text();
      console.log("Raw Response:", responseText);

      let data;
      try {
        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
          data = JSON.parse(responseText);
        } else {
          data = { message: responseText };
        }
      } catch (jsonError) {
        console.error("Failed to parse JSON:", jsonError);
        data = { message: "An unexpected error occurred" };
      }

      if (response.ok) {
        setSuccessMessage(data.message);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">
          Register
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500">
            Register
          </button>
        </form>
        <p className="text-gray-600 dark:text-gray-400 text-center mt-4">
          Already have an account? {" "}
          <span onClick={() => navigate("/login")} className="text-blue-600 hover:underline cursor-pointer">
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
