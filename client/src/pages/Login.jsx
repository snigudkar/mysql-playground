// client/src/pages/Login.jsx
import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from 'lucide-react'; // Import icons

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // State for error messages
  const navigate = useNavigate();
  const auth = getAuth(); // Assumes Firebase app is initialized globally

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // Redirect to the playground after successful login
    } catch (error) {
      console.error("Login failed:", error);
      // More user-friendly error messages
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white p-6">
      <div className="max-w-lg w-full p-8 bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-xl border border-white/10">
        <h2 className="text-3xl text-center font-bold text-purple-400 mb-6 flex items-center justify-center">
          <LogIn className="w-8 h-8 mr-3" /> Sign In
        </h2>

        {error && (
          <div className="bg-red-700/70 text-white p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="relative mb-4">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 pl-10 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-400 outline-none transition-all duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative mb-6">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 pl-10 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-400 outline-none transition-all duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mb-4 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-500 hover:to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <a href="/signup" className="text-purple-400 hover:underline font-medium">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
