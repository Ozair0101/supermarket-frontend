import React from 'react';

const TestStyles: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Test Styles</h1>
      <p className="text-gray-700 mb-4">If you can see this text styled with Tailwind CSS, then the styles are working correctly.</p>
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        <p>This is a styled alert box using Tailwind CSS classes.</p>
      </div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        This is a styled button
      </button>
    </div>
  );
};

export default TestStyles;