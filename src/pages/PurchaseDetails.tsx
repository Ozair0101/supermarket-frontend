import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPurchase, deletePurchase } from '../services/purchaseService';
import { createPayment, getPaymentsForPurchase } from '../services/paymentService';
import type { Purchase } from '../services/purchaseService';
import type { Payment } from '../services/paymentService';
import { Edit, Trash2, ArrowLeft, Printer } from 'lucide-react';

const PurchaseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'bank_transfer'>('cash');

  useEffect(() => {
    if (id) {
      fetchPurchase(parseInt(id));
      fetchPayments(parseInt(id));
    }
  }, [id]);

  const fetchPurchase = async (purchaseId: number) => {
    try {
      const data = await getPurchase(purchaseId);
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
      setPurchase(parsedData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching purchase:', err);
      setError('Failed to load purchase details');
      setLoading(false);
    }
  };

  const fetchPayments = async (purchaseId: number) => {
    try {
      const data = await getPaymentsForPurchase(purchaseId);
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
    if (!purchase?.id) return;
    
    if (window.confirm('Are you sure you want to delete this purchase?')) {
      try {
        await deletePurchase(purchase.id);
        navigate('/purchases');
      } catch (err) {
        console.error('Error deleting purchase:', err);
        alert('Failed to delete purchase');
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchase?.id || !paymentAmount) return;

    try {
      const amount = parseFloat(paymentAmount);
      const remaining = typeof purchase.remaining === 'string' 
        ? parseFloat(purchase.remaining) 
        : purchase.remaining;
        
      if (amount <= 0 || amount > remaining) {
        alert('Please enter a valid payment amount');
        return;
      }

      const paymentData = {
        payable_type: 'App\\Models\\Purchase',
        payable_id: purchase.id,
        amount: amount,
        method: paymentMethod,
        paid_at: new Date().toISOString().split('T')[0],
      };

      await createPayment(paymentData);
      
      // Refresh purchase and payments
      await fetchPurchase(purchase.id);
      await fetchPayments(purchase.id);
      
      // Reset form
      setPaymentAmount('');
      setShowPaymentForm(false);
      
      alert('Payment added successfully');
    } catch (err) {
      console.error('Error adding payment:', err);
      alert('Failed to add payment');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !purchase) {
    return (
      <div className="bg-red-50 dark:bg-red-900 rounded-lg p-4">
        <p className="text-red-800 dark:text-red-200">{error || 'Purchase not found'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/purchases')}
            className="mr-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Purchase Details</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View and manage purchase information
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
            onClick={() => navigate(`/purchases/${purchase.id}/edit`)}
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
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Purchase Information</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Invoice Number</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{purchase.invoice_number || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Supplier</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {purchase.supplier ? purchase.supplier.name : 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Purchase Date</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {purchase.purchase_date ? new Date(purchase.purchase_date).toLocaleDateString() : 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                <dd className="mt-1">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    purchase.status === 'paid' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                      : purchase.status === 'partial' 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                  }`}>
                    {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Financial Summary</h3>
              {(purchase.status === 'partial' || purchase.status === 'credit') && 
              (typeof purchase.remaining === 'string' ? parseFloat(purchase.remaining) : purchase.remaining) > 0 && (
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
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">${Number(purchase.sub_total).toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Discount</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">${Number(purchase.discount).toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Tax</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">${Number(purchase.tax).toFixed(2)}</dd>
              </div>
              <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
                <dt className="text-sm font-medium text-gray-900 dark:text-white">Total</dt>
                <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-white">${Number(purchase.total).toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Paid</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">${Number(purchase.paid).toFixed(2)}</dd>
              </div>
              <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
                <dt className="text-sm font-medium text-gray-900 dark:text-white">Remaining</dt>
                <dd className={`mt-1 text-sm font-medium ${
                  (typeof purchase.remaining === 'string' ? parseFloat(purchase.remaining) : purchase.remaining) < 0 
                  ? 'text-red-600' 
                  : 'text-gray-900 dark:text-white'
                }`}>
                  ${typeof purchase.remaining === 'string' 
                    ? parseFloat(purchase.remaining).toFixed(2) 
                    : purchase.remaining?.toFixed(2)}
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
                    Unit Cost
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
                {purchase.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {item.product ? item.product.name : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ${Number(item.unit_cost).toFixed(2)}
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
                    max={typeof purchase?.remaining === 'string' 
                      ? parseFloat(purchase.remaining) 
                      : purchase?.remaining}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Remaining: ${typeof purchase?.remaining === 'string' 
                      ? parseFloat(purchase.remaining).toFixed(2) 
                      : purchase?.remaining?.toFixed(2) || '0.00'}
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

export default PurchaseDetails;