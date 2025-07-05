// client/src/pages/ResourcesPage.jsx
import React from 'react';
import { Link2 } from 'lucide-react';

/**
 * Dummy ResourcesPage component.
 */
const ResourcesPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white p-6">
      <Link2 className="w-24 h-24 text-orange-400 mb-8 animate-pulse" />
      <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
        Useful Resources
      </h1>
      <p className="text-xl text-gray-300 text-center max-w-2xl mb-8">
        A curated list of valuable links, documentation, and external tools to aid your SQL learning journey will be added here.
      </p>
      <div className="mt-12 text-gray-500 text-sm">
        <p>Check back soon for more!</p>
      </div>
    </div>
  );
};

export default ResourcesPage;
