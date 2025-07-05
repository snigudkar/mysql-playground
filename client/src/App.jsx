// client/src/App.jsx
import React from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'; // Import router components and hook

// Import page components
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import ResourcesPage from './pages/ResourcesPage';
import Login from './pages/Login'; // Import Login page
import SignUp from './pages/SignUp'; // Import SignUp page
import PlaygroundPage from './pages/PlaygroundPage'; // Import new PlaygroundPage

// Import Lucide React icons
import { Code, BookOpen, Link2, LogOut, User, Home, LogIn } from 'lucide-react';

// Import custom auth hook
import useAuth from './hooks/useAuth';


function App() {
  const navigate = useNavigate(); // For programmatic navigation
  const { isLoggedIn, user, isAuthReady, handleLogout } = useAuth(); // Use the new useAuth hook

  // Render a loading state while authentication is being determined
  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white flex items-center justify-center">
        <p className="text-xl text-purple-300 animate-pulse">Loading user session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white overflow-hidden relative font-sans">
      {/* Navigation Bar */}
      <nav className="relative z-20 flex justify-between items-center p-6 backdrop-blur-md bg-black/30 border-b border-purple-500/20">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="relative">
            <Code className="w-10 h-10 text-purple-400" />
            <div className="absolute inset-0 bg-purple-400/20 rounded-full animate-pulse"></div>
          </div>
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              QueryQuest
            </span>
            <p className="text-xs text-gray-400">Interactive Database Learning</p>
          </div>
        </div>
        <div className="flex items-center space-x-8">
          {/* Navigation buttons */}
          <button
            className="hover:text-purple-400 transition-colors duration-300 text-lg flex items-center text-gray-300"
            onClick={() => navigate('/playground')}
          >
            <Code className="w-5 h-5 mr-2" /> Playground
          </button>
          <button
            className="hover:text-purple-400 transition-colors duration-300 text-lg flex items-center text-gray-300"
            onClick={() => navigate('/courses')}
          >
            <BookOpen className="w-5 h-5 mr-2" /> Mini Courses
          </button>
          <button
            className="hover:text-purple-400 transition-colors duration-300 text-lg flex items-center text-gray-300"
            onClick={() => navigate('/resources')}
          >
            <Link2 className="w-5 h-5 mr-2" /> Resources
          </button>

          <div className="w-px h-6 bg-gray-600"></div> {/* Separator */}

          {/* Login/Logout display based on isAuthenticated */}
          {isLoggedIn ? (
            <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 px-4 py-2 rounded-full border border-purple-500/30">
              <User className="w-5 h-5 text-purple-400" />
              <span className="text-purple-200 text-sm font-mono">{user?.uid.substring(0, 6)}...</span>
              <button
                onClick={handleLogout}
                className="ml-2 text-gray-300 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-600/20 to-gray-700/20 hover:from-gray-500/20 hover:to-gray-600/20 text-gray-300 font-semibold rounded-full shadow-md transition-all duration-300 transform hover:scale-105"
            >
              <LogIn className="w-5 h-5 mr-2" /> Login
            </button>
          )}
        </div>
      </nav>

      {/* Main Content Area - Routes */}
      <div className="relative z-10 p-6 flex flex-col items-center flex-grow">
        <Routes>
          <Route path="/" element={<HomePage isAuthenticated={isLoggedIn} />} />
          <Route
            path="/playground"
            element={isLoggedIn ? <PlaygroundPage userId={user?.uid} isAuthenticated={isLoggedIn} isAuthReady={isAuthReady} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/courses"
            element={isLoggedIn ? <CoursesPage userId={user?.uid} isAuthenticated={isLoggedIn} /> : <Navigate to="/login" replace />}
          />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
