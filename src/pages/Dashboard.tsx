import React from 'react';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  // Mock data for dashboard cards
  const stats = [
    { name: 'Total Products', value: '1,248', change: '+12%', icon: Package },
    { name: 'Sales Today', value: '$24,560', change: '+8.2%', icon: ShoppingCart },
    { name: 'Customers', value: '1,842', change: '+3.1%', icon: Users },
    { name: 'Revenue', value: '$186,420', change: '+15.3%', icon: DollarSign },
  ];

  // Mock data for recent activity
  const recentActivity = [
    { id: 1, product: 'Organic Apples', category: 'Fruits', quantity: 50, status: 'In Stock' },
    { id: 2, product: 'Whole Milk', category: 'Dairy', quantity: 5, status: 'Low Stock' },
    { id: 3, product: 'Whole Wheat Bread', category: 'Bakery', quantity: 12, status: 'In Stock' },
    { id: 4, product: 'Free Range Eggs', category: 'Dairy', quantity: 0, status: 'Out of Stock' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-md bg-blue-500 p-3">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {stat.value}
                        </div>
                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                          <TrendingUp className="h-4 w-4" />
                          <span className="sr-only">Increased by</span>
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Chart */}
        <div className="lg:col-span-2">
          <div className="rounded-lg bg-white dark:bg-gray-800 shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Sales Overview
            </h2>
            <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Sales chart visualization would appear here
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="rounded-lg bg-white dark:bg-gray-800 shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Inventory Status
            </h2>
            <div className="flow-root">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentActivity.map((activity) => (
                  <li key={activity.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {activity.product}
                        </p>
                        <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                          {activity.category}
                        </p>
                      </div>
                      <div className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
                        {activity.quantity} in stock
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          activity.status === 'In Stock' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                            : activity.status === 'Low Stock' 
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;