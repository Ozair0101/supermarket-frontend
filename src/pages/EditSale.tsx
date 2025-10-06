import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
// import { getSale, updateSale } from '../services/saleService';
// import type { Sale } from '../services/saleService';
import SaleForm from '../components/sales/SaleForm';

const EditSale: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sale, setSale] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // TODO: Implement getSale service
    // if (id) {
    //   fetchSale(parseInt(id));
    // }
    setLoading(false);
  }, [id]);

  // const fetchSale = async (saleId: number) => {
  //   try {
  //     const data = await getSale(saleId);
  //     setSale(data);
  //     setLoading(false);
  //   } catch (err) {
  //     console.error('Error fetching sale:', err);
  //     setMessage({ type: 'error', text: 'Failed to load sale details' });
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (data: any) => {
    try {
      // TODO: Implement updateSale service
      // if (id) {
      //   await updateSale(parseInt(id), data);
      //   setMessage({ type: 'success', text: 'Sale updated successfully!' });
      //   setTimeout(() => {
      //     navigate('/sales');
      //   }, 1500);
      // }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update sale';
      setMessage({ type: 'error', text: errorMessage });
      console.error('Error updating sale:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button
          onClick={() => navigate('/sales')}
          className="mr-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Sale</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Update sale information
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
        {sale ? (
          <SaleForm
            initialData={sale}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/sales')}
          />
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>Sale not found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditSale;