// client/src/pages/SignUp.jsx
import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, UserPlus } from 'lucide-react'; // Import icons

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null); // State for error messages
  const navigate = useNavigate();
  const auth = getAuth(); // Assumes Firebase app is initialized globally

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/playground"); // Redirect to the playground after successful sign-up
    } catch (error) {
      console.error("Sign-up failed:", error);
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Try signing in.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
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
        <h2 className="text-3xl text-center font-bold text-emerald-400 mb-6 flex items-center justify-center">
          <UserPlus className="w-8 h-8 mr-3" /> Sign Up
        </h2>

        {error && (
          <div className="bg-red-700/70 text-white p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp}>
          <div className="relative mb-4">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 pl-10 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder-gray-400 outline-none transition-all duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative mb-4">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 pl-10 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder-gray-400 outline-none transition-all duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="relative mb-6">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-3 pl-10 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder-gray-400 outline-none transition-all duration-200"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mb-4 py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-emerald-400 hover:underline font-medium">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
