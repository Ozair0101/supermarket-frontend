import React from 'react';

const TestComponent: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-blue-500 mb-4">Tailwind CSS Test</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="text-gray-700">
          If you can see this text in a white box with a shadow and blue heading, Tailwind CSS is working!
        </p>
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
          This should have a green background if Tailwind is working correctly.
        </div>
      </div>
    </div>
  );
};

export default TestComponent;