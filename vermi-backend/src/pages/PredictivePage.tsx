// PredictivePage.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const PredictivePage = () => {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Predictive Tools</h1>
      {/* Add predictive overview or sidebar here */}
      <Outlet /> {/* <- this renders nested routes */}
    </div>
  );
};

export default PredictivePage;
