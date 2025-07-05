// client/src/pages/CoursesPage.jsx
import React from 'react';
import { BookOpen, User } from 'lucide-react';

/**
 * Dummy CoursesPage component.
 * @param {{userId: string|null, isAuthenticated: boolean}} props
 */
const CoursesPage = ({ userId, isAuthenticated }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white p-6">
      <BookOpen className="w-24 h-24 text-emerald-400 mb-8 animate-pulse" />
      <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
        Our Courses
      </h1>
      <p className="text-xl text-gray-300 text-center max-w-2xl">
        Structured learning paths and engaging detective mysteries are coming soon!
        Prepare to master SQL step-by-step.
      </p>

      {/* Display user authentication status for testing/development */}
      <div className="mt-8 text-gray-400 text-sm flex items-center space-x-2">
        {isAuthenticated ? (
          <>
            <User className="w-4 h-4 text-purple-300" />
            <span>Logged in as: <span className="font-mono text-purple-200">{userId ? userId.substring(0, 10) + '...' : 'N/A'}</span></span>
          </>
        ) : (
          <span>Not logged in. Progress will not be saved.</span>
        )}
      </div>

      <div className="mt-12 text-gray-500 text-sm">
        <p>Stay tuned for exciting updates!</p>
      </div>
    </div>
  );
};

export default CoursesPage;
