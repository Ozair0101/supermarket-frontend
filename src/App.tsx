import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Suppliers from './pages/Suppliers';
import POS from './pages/POS';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="pos" element={<POS />} />
            <Route path="purchases" element={<div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">Purchases</div>} />
            <Route path="sales" element={<div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">Sales</div>} />
            <Route path="customers" element={<div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">Customers</div>} />
            <Route path="reports" element={<div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">Reports</div>} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;