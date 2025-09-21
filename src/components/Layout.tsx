import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Supermarket Management System</h1>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-4 py-4 border-b border-gray-200">
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Dashboard
          </Link>
          <Link to="/products" className="text-blue-600 hover:text-blue-800">
            Products
          </Link>
          <Link to="/categories" className="text-blue-600 hover:text-blue-800">
            Categories
          </Link>
          <Link to="/suppliers" className="text-blue-600 hover:text-blue-800">
            Suppliers
          </Link>
          <Link to="/pos" className="text-blue-600 hover:text-blue-800">
            POS
          </Link>
          <Link to="/purchases" className="text-blue-600 hover:text-blue-800">
            Purchases
          </Link>
          <Link to="/sales" className="text-blue-600 hover:text-blue-800">
            Sales
          </Link>
          <Link to="/customers" className="text-blue-600 hover:text-blue-800">
            Customers
          </Link>
          <Link to="/reports" className="text-blue-600 hover:text-blue-800">
            Reports
          </Link>
        </div>
      </div>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;