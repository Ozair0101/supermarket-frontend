import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCustomer, deleteCustomer } from '../services/customerService';
import type { Customer } from '../services/customerService';
import { Edit, Trash2, ArrowLeft } from 'lucide-react';

const CustomerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCustomer(parseInt(id));
    }
  }, [id]);

  const fetchCustomer = async (customerId: number) => {
    try {
      const data = await getCustomer(customerId);
      setCustomer(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching customer:', err);
      setError('Failed to load customer details');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!customer?.id) return;
    
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(customer.id);
        navigate('/customers');
      } catch (err) {
        console.error('Error deleting customer:', err);
        alert('Failed to delete customer');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="bg-red-50 dark:bg-red-900 rounded-lg p-4">
        <p className="text-red-800 dark:text-red-200">{error || 'Customer not found'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/customers')}
            className="mr-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Details</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View and manage customer information
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/customers/${customer.id}/edit`)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Edit className="mr-1 h-4 w-4" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Customer Information</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{customer.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{customer.email || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{customer.phone || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{customer.address || 'N/A'}</dd>
              </div>
            </dl>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">System Information</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer ID</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{customer.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {customer.updated_at ? new Date(customer.updated_at).toLocaleDateString() : 'N/A'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;