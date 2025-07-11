// client/src/pages/PlaygroundDashboardPage.jsx
import React from 'react';
import { Code, BookOpen, Link2, Play, LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * PlaygroundDashboardPage component. This serves as the dashboard for the SQL Playground section,
 * providing links to the SQL editor, courses, and resources.
 * @param {{isAuthenticated: boolean, userId: string}} props Authentication status and user ID.
 */
const PlaygroundDashboardPage = ({ isAuthenticated, userId }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white p-6 bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950">
      <div className="text-center mb-12">
        <h1 className="text-6xl md:text-7xl font-extrabold mb-4 tracking-wider">
          <span className="text-white drop-shadow-2xl">SQL </span>
          <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
            Playground Dashboard
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-purple-300 px-6 font-medium">
          Choose your path to SQL mastery.
        </p>
        {isAuthenticated ? (
            <p className="mt-4 text-md text-gray-400">
                You are logged in {userId ? `(User ID: ${userId.substring(0, 6)}...)` : ''}. Dive in!
            </p>
        ) : (
            <p className="mt-4 text-md text-gray-400">
                Log in on the main homepage to save your progress and access personalized features.
            </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        {/* SQL Playground Card - Navigates to the actual PlaygroundPage (editor) */}
        <div
          className="bg-gray-800/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center cursor-pointer
                     hover:border-purple-400/40 transition-all duration-300 transform hover:scale-105 group"
          onClick={() => navigate('/playground/editor')} // Navigate to the actual SQL editor page
        >
          <Code className="w-16 h-16 mx-auto mb-6 text-cyan-400 group-hover:text-purple-300 transition-colors" />
          <h2 className="text-3xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors">SQL Editor</h2>
          <p className="text-gray-300 mb-6">Write, test, and debug SQL queries in our interactive environment.</p>
          <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-500 hover:to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <Play className="w-5 h-5 mr-2" /> Start Querying
          </button>
        </div>

        {/* Courses Card */}
        <div
          className="bg-gray-800/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center cursor-pointer
                     hover:border-emerald-400/40 transition-all duration-300 transform hover:scale-105 group"
          onClick={() => navigate('/courses')}
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
          onClick={() => navigate('/resources')}
        >
          <Link2 className="w-16 h-16 mx-auto mb-6 text-orange-400 group-hover:text-yellow-300 transition-colors" />
          <h2 className="text-3xl font-bold mb-3 text-white group-hover:text-yellow-300 transition-colors">Resources</h2>
          <p className="text-gray-300 mb-6">Find useful links, documentation, and external learning materials.</p>
          <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-500 hover:to-amber-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            View Resources
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaygroundDashboardPage;