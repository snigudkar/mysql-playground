
import React from 'react';

const ProgressBar = ({ current, total, className = "" }) => {
  const percentage = (current / total) * 100;

  return (
    <div className={`w-full bg-gray-700 rounded-full h-2 ${className}`}>
      <div
        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;