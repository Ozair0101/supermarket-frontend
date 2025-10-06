import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCustomer, updateCustomer } from '../services/customerService';
import type { Customer } from '../services/customerService';
import CustomerForm from '../components/customers/CustomerForm';
import { ArrowLeft } from 'lucide-react';

const EditCustomer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  const handleSubmit = async (data: Omit<Customer, 'id'>) => {
    if (!customer?.id) return;
    
    try {
      await updateCustomer(customer.id, data);
      setMessage({ type: 'success', text: 'Customer updated successfully!' });
      setTimeout(() => {
        navigate('/customers');
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update customer';
      setMessage({ type: 'error', text: errorMessage });
      console.error('Error updating customer:', err);
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
      <div className="flex items-center">
        <button
          onClick={() => navigate('/customers')}
          className="mr-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Customer</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Update customer information
          </p>
        </div>
      </div>

      {/* Display success or error messages */}
      {message && (
        <div className={`rounded-md p-4 ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900' : 'bg-red-50 dark:bg-red-900'}`}>
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
              <h3 className={`text-sm font-medium ${message.type === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                {message.text}
              </h3>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <CustomerForm
          initialData={customer}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/customers')}
        />
      </div>
    </div>
  );
};

export default EditCustomer;