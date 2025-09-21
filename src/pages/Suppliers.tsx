import React, { useState } from 'react';
import SupplierList from '../components/suppliers/SupplierList';
import SupplierForm from '../components/suppliers/SupplierForm';
import type { SupplierFormData } from '../services/supplierService';

const Suppliers: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  const handleCreateSupplier = (data: SupplierFormData) => {
    // Handle supplier creation
    console.log('Creating supplier:', data);
    setShowForm(false);
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Suppliers</h1>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Supplier
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {showForm ? (
            <div className="bg-white shadow sm:rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Supplier</h2>
              <SupplierForm
                onSubmit={handleCreateSupplier}
                onCancel={() => setShowForm(false)}
              />
            </div>
          ) : (
            <SupplierList />
          )}
        </div>
      </div>
    </div>
  );
};

export default Suppliers;