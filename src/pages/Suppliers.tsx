import React, { useState } from 'react';
import SupplierList from '../components/suppliers/SupplierList';
import SupplierForm from '../components/suppliers/SupplierForm';
import { createSupplier, type SupplierFormData } from '../services/supplierService';

const Suppliers: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleCreateSupplier = async (data: SupplierFormData) => {
    try {
      await createSupplier(data);
      setMessage({ type: 'success', text: 'Supplier created successfully!' });
      setShowForm(false);
      // Optionally refresh the supplier list here
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create supplier';
      setMessage({ type: 'error', text: errorMessage });
      console.error('Error creating supplier:', error);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Suppliers</h1>
          <button
            onClick={() => {
              setShowForm(true);
              setMessage(null); // Clear any previous messages
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Supplier
          </button>
        </div>
      </div>
      
      {/* Display success or error messages */}
      {message && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-4">
          <div className={`rounded-md p-4 ${message.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {message.type === 'success' ? (
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                  {message.text}
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {showForm ? (
            <div className="bg-white shadow sm:rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Supplier</h2>
              <SupplierForm
                onSubmit={handleCreateSupplier}
                onCancel={() => {
                  setShowForm(false);
                  setMessage(null); // Clear any messages when canceling
                }}
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