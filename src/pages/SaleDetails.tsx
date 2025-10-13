import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Edit, Trash2, ArrowLeft, Printer } from 'lucide-react';
import { getSale, deleteSale } from '../services/saleService';
import { createPayment, getPaymentsForSale } from '../services/paymentService';
import type { Sale } from '../services/saleService';
import type { Payment } from '../services/paymentService';

const SaleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'bank_transfer'>('cash');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchSale(parseInt(id));
      fetchPayments(parseInt(id));
    }
  }, [id]);

  const fetchSale = async (saleId: number) => {
    try {
      const data = await getSale(saleId);
      // Ensure numeric fields are proper numbers
      const parsedData = {
        ...data,
        sub_total: typeof data.sub_total === 'string' ? parseFloat(data.sub_total) : data.sub_total,
        discount: typeof data.discount === 'string' ? parseFloat(data.discount) : data.discount,
        tax: typeof data.tax === 'string' ? parseFloat(data.tax) : data.tax,
        total: typeof data.total === 'string' ? parseFloat(data.total) : data.total,
        paid: typeof data.paid === 'string' ? parseFloat(data.paid) : data.paid,
        remaining: typeof data.remaining === 'string' ? parseFloat(data.remaining) : data.remaining
      };
      setSale(parsedData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching sale:', err);
      setError('Failed to load sale details');
      setLoading(false);
    }
  };

  const fetchPayments = async (saleId: number) => {
    try {
      const data = await getPaymentsForSale(saleId);
      // Ensure payment amounts are proper numbers
      const parsedData = data.map(payment => ({
        ...payment,
        amount: typeof payment.amount === 'string' ? parseFloat(payment.amount) : payment.amount
      }));
      setPayments(parsedData);
    } catch (err) {
      console.error('Error fetching payments:', err);
    }
  };

  const handleDelete = async () => {
    if (!sale?.id) return;
    
    if (window.confirm('Are you sure you want to delete this sale?')) {
      try {
        await deleteSale(sale.id);
        navigate('/sales');
      } catch (err) {
        console.error('Error deleting sale:', err);
        alert('Failed to delete sale');
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sale?.id || !paymentAmount) return;

    try {
      const amount = parseFloat(paymentAmount);
      const remaining = typeof sale.remaining === 'string' 
        ? parseFloat(sale.remaining) 
        : sale.remaining;
        
      if (amount <= 0 || amount > remaining) {
        setErrorMessage('Please enter a valid payment amount');
        // Clear error message after 3 seconds
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
        return;
      }

      const paymentData = {
        payable_type: 'App\\Models\\Sale',
        payable_id: sale.id,
        amount: amount,
        method: paymentMethod,
        paid_at: new Date().toISOString().split('T')[0],
      };

      await createPayment(paymentData);
      
      // Refresh sale and payments
      await fetchSale(sale.id);
      await fetchPayments(sale.id);
      
      // Reset form
      setPaymentAmount('');
      setShowPaymentForm(false);
      
      // Show success message
      setSuccessMessage('Payment added successfully');
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error adding payment:', err);
      setErrorMessage('Failed to add payment');
      // Clear error message after 3 seconds
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !sale) {
    return (
      <div className="bg-red-50 dark:bg-red-900 rounded-lg p-4">
        <p className="text-red-800 dark:text-red-200">{error || 'Sale not found'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/sales')}
            className="mr-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sale Details</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View and manage sale information
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Printer className="mr-1 h-4 w-4" />
            Print
          </button>
          <button
            onClick={() => navigate(`/sales/${sale.id}/edit`)}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Sale Information</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Invoice Number</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{sale.invoice_number || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {sale.customer ? sale.customer.name : 'Walked-in Customer'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Sale Date</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {sale.sale_date ? new Date(sale.sale_date).toLocaleDateString() : 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                <dd className="mt-1">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    sale.status === 'paid' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                      : sale.status === 'partial' 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                  }`}>
                    {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Financial Summary</h3>
              {(sale.status === 'partial' || sale.status === 'unpaid') && 
              (typeof sale.remaining === 'string' ? parseFloat(sale.remaining) : sale.remaining) > 0 && (
                <button
                  onClick={() => setShowPaymentForm(true)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Payment
                </button>
              )}
            </div>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Subtotal</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">${Number(sale.sub_total).toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Discount</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">${Number(sale.discount).toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Tax</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">${Number(sale.tax).toFixed(2)}</dd>
              </div>
              <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
                <dt className="text-sm font-medium text-gray-900 dark:text-white">Total</dt>
                <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-white">${Number(sale.total).toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Paid</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">${Number(sale.paid).toFixed(2)}</dd>
              </div>
              <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
                <dt className="text-sm font-medium text-gray-900 dark:text-white">Remaining</dt>
                <dd className={`mt-1 text-sm font-medium ${
                  (typeof sale.remaining === 'string' ? parseFloat(sale.remaining) : sale.remaining) < 0 
                  ? 'text-red-600' 
                  : 'text-gray-900 dark:text-white'
                }`}>
                  ${typeof sale.remaining === 'string' 
                    ? parseFloat(sale.remaining).toFixed(2) 
                    : sale.remaining?.toFixed(2)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Items</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Discount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {sale.items && sale.items.map((item: any) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {item.product ? item.product.name : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ${Number(item.unit_price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ${Number(item.discount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ${Number(item.line_total).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment form modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add Payment</h3>
            <form onSubmit={handleAddPayment}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={typeof sale?.remaining === 'string' 
                      ? parseFloat(sale.remaining) 
                      : sale?.remaining}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Remaining: ${typeof sale?.remaining === 'string' 
                      ? parseFloat(sale.remaining).toFixed(2) 
                      : sale?.remaining?.toFixed(2) || '0.00'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'card' | 'bank_transfer')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPaymentForm(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                {errorMessage}
              </p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setErrorMessage(null)}
                  className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Success message */}
      {successMessage && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                {successMessage}
              </p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Payment history section */}
      {payments.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Method
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(payment.paid_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ${typeof payment.amount === 'string' 
                        ? parseFloat(payment.amount).toFixed(2) 
                        : payment.amount?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {payment.method.charAt(0).toUpperCase() + payment.method.slice(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaleDetails;