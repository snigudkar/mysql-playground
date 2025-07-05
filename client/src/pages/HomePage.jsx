// client/src/pages/HomePage.jsx
import React from 'react';
import { Code, BookOpen, Link2, Play, LogIn, UserPlus } from 'lucide-react'; // Import icons
import { useNavigate } from 'react-router-dom'; // Import useNavigate

/**
 * HomePage component for the SQL Mastery Hub.
 * @param {{setCurrentPage: Function, isAuthenticated: boolean}} props Function to change the current page.
 */
const HomePage = ({ setCurrentPage, isAuthenticated }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white p-6">
      <div className="text-center mb-12">
        <h1 className="text-6xl md:text-7xl font-extrabold mb-4 tracking-wider">
          <span className="text-white drop-shadow-2xl">SQL </span>
          <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
            QueryQuest
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-purple-300 px-6 font-medium">
          Your journey to SQL excellence starts here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        {/* SQL Playground Card */}
        <div
          className="bg-gray-800/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center cursor-pointer
                     hover:border-purple-400/40 transition-all duration-300 transform hover:scale-105 group"
          onClick={() => navigate('/playground')} // Use navigate
        >
          <Code className="w-16 h-16 mx-auto mb-6 text-cyan-400 group-hover:text-purple-300 transition-colors" />
          <h2 className="text-3xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors">SQL Playground</h2>
          <p className="text-gray-300 mb-6">Practice queries, debug with AI, and experiment in a live environment.</p>
          <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-500 hover:to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <Play className="w-5 h-5 mr-2" /> Start Querying
          </button>
        </div>

        {/* Courses Card */}
        <div
          className="bg-gray-800/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center cursor-pointer
                     hover:border-emerald-400/40 transition-all duration-300 transform hover:scale-105 group"
          onClick={() => navigate('/courses')} // Use navigate
        >
          <BookOpen className="w-16 h-16 mx-auto mb-6 text-emerald-400 group-hover:text-green-300 transition-colors" />
          <h2 className="text-3xl font-bold mb-3 text-white group-hover:text-green-300 transition-colors">Courses</h2>
          <p className="text-gray-300 mb-6">Dive into structured mini-courses and detective mysteries (coming soon!).</p>
          <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            Explore Courses
          </button>
        </div>

        {/* Resources Card */}
        <div
          className="bg-gray-800/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center cursor-pointer
                     hover:border-orange-400/40 transition-all duration-300 transform hover:scale-105 group"
          onClick={() => navigate('/resources')} // Use navigate
        >
          <Link2 className="w-16 h-16 mx-auto mb-6 text-orange-400 group-hover:text-yellow-300 transition-colors" />
          <h2 className="text-3xl font-bold mb-3 text-white group-hover:text-yellow-300 transition-colors">Resources</h2>
          <p className="text-gray-300 mb-6">Find useful links, documentation, and external learning materials.</p>
          <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-500 hover:to-amber-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            View Resources
          </button>
        </div>

        {/* Login/Signup Cards (Conditional)
        {!isAuthenticated && (
          <>
            <div
              className="bg-gray-800/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center cursor-pointer
                         hover:border-blue-400/40 transition-all duration-300 transform hover:scale-105 group"
              onClick={() => navigate('/login')}
            >
              <LogIn className="w-16 h-16 mx-auto mb-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
              <h2 className="text-3xl font-bold mb-3 text-white group-hover:text-blue-300 transition-colors">Login</h2>
              <p className="text-gray-300 mb-6">Access your personalized history and progress.</p>
              <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Sign In
              </button>
            </div>
            <div
              className="bg-gray-800/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center cursor-pointer
                         hover:border-green-400/40 transition-all duration-300 transform hover:scale-105 group"
              onClick={() => navigate('/signup')}
            >
              <UserPlus className="w-16 h-16 mx-auto mb-6 text-green-400 group-hover:text-green-300 transition-colors" />
              <h2 className="text-3xl font-bold mb-3 text-white group-hover:text-green-300 transition-colors">Sign Up</h2>
              <p className="text-gray-300 mb-6">Create an account to track your learning journey.</p>
              <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-lime-700 hover:from-green-500 hover:to-lime-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Register Now
              </button>
            </div>
          </>
        )} */}
      </div>
    </div>
  );
};

export default HomePage;
