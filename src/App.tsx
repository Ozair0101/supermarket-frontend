import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Suppliers from './pages/Suppliers';
import POS from './pages/POS';
import TestComponent from './components/TestComponent';

function App() {
  return (
    <Router>
      <div className="p-4">
        {/* Test button to verify Tailwind is working */}
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
          Test Button - If styled, Tailwind is working!
        </button>
        
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={
              <div>
                <Dashboard />
                <TestComponent />
              </div>
            } />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="pos" element={<POS />} />
            <Route path="purchases" element={<div>Purchases</div>} />
            <Route path="sales" element={<div>Sales</div>} />
            <Route path="customers" element={<div>Customers</div>} />
            <Route path="reports" element={<div>Reports</div>} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;