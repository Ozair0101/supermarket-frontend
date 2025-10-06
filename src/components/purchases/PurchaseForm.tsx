import React, { useState, useEffect } from 'react';
import type { PurchaseFormData, PurchaseItem } from '../../services/purchaseService';
import { getProducts } from '../../services/productService';
import { getSuppliers } from '../../services/supplierService';
import type { Product } from '../../services/productService';
import type { Supplier } from '../../services/supplierService';

interface PurchaseFormProps {
  initialData?: Partial<PurchaseFormData>;
  onSubmit: (data: PurchaseFormData) => void;
  onCancel: () => void;
}

const PurchaseForm: React.FC<PurchaseFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState<PurchaseFormData>({
    supplier_id: initialData?.supplier_id || 0,
    invoice_number: initialData?.invoice_number || '',
    sub_total: initialData?.sub_total || 0,
    discount: initialData?.discount || 0,
    tax: initialData?.tax || 0,
    total: initialData?.total || 0,
    paid: initialData?.paid || 0,
    remaining: initialData?.remaining || 0,
    status: initialData?.status || 'paid',
    purchase_date: initialData?.purchase_date || new Date().toISOString().split('T')[0],
    items: initialData?.items || [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, suppliersData] = await Promise.all([
          getProducts(),
          getSuppliers()
        ]);
        setProducts(productsData);
        setSuppliers(suppliersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'supplier_id' ? parseInt(value) : value
    } as PurchaseFormData));
  };

  const handleItemChange = (index: number, field: keyof PurchaseItem, value: string | number) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'product_id' || field === 'quantity' || field === 'unit_cost' || field === 'discount' 
        ? Number(value) 
        : value
    };
    
    // Calculate line total
    if (field === 'quantity' || field === 'unit_cost' || field === 'discount') {
      const quantity = field === 'quantity' ? Number(value) : updatedItems[index].quantity;
      const unitCost = field === 'unit_cost' ? Number(value) : updatedItems[index].unit_cost;
      const discount = field === 'discount' ? Number(value) : updatedItems[index].discount;
      updatedItems[index].line_total = quantity * unitCost - discount;
    }
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          product_id: 0,
          quantity: 1,
          unit_cost: 0,
          discount: 0,
          line_total: 0
        }
      ]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateTotals = () => {
    const subTotal = formData.items.reduce((sum, item) => sum + item.line_total, 0);
    const total = subTotal - formData.discount + formData.tax;
    const remaining = total - formData.paid;
    
    setFormData(prev => ({
      ...prev,
      sub_total: parseFloat(subTotal.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      remaining: parseFloat(remaining.toFixed(2))
    }));
  };

  useEffect(() => {
    calculateTotals();
  }, [formData.items, formData.discount, formData.tax, formData.paid]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    if (formData.supplier_id === 0) {
      alert('Please select a supplier');
      return;
    }
    if (formData.items.length === 0) {
      alert('Please add at least one item');
      return;
    }
    if (formData.items.some(item => item.product_id === 0)) {
      alert('Please select a product for all items');
      return;
    }
    
    onSubmit(formData);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="supplier_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Supplier
          </label>
          <select
            id="supplier_id"
            name="supplier_id"
            value={formData.supplier_id}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select a supplier</option>
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="invoice_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Invoice Number
          </label>
          <input
            type="text"
            name="invoice_number"
            id="invoice_number"
            value={formData.invoice_number}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="purchase_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Purchase Date
          </label>
          <input
            type="date"
            name="purchase_date"
            id="purchase_date"
            value={formData.purchase_date}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          >
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="credit">Credit</option>
          </select>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Items</h3>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Item
          </button>
        </div>

        {formData.items.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No items added yet. Click "Add Item" to start.
          </div>
        ) : (
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
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {formData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={item.product_id}
                        onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                        required
                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Select product</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        required
                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unit_cost}
                        onChange={(e) => handleItemChange(index, 'unit_cost', e.target.value)}
                        required
                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.discount}
                        onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ${Number(item.line_total).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div></div>
        <div className="md:col-span-2">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
              <span>${Number(formData.sub_total).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Discount:</span>
              <span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  className="w-24 text-right border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                />
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Tax:</span>
              <span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="tax"
                  value={formData.tax}
                  onChange={handleInputChange}
                  className="w-24 text-right border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                />
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
              <span className="font-medium">Total:</span>
              <span className="font-medium">${Number(formData.total).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Paid:</span>
              <span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="paid"
                  value={formData.paid}
                  onChange={handleInputChange}
                  className="w-24 text-right border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                />
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
              <span className="font-medium">Remaining:</span>
              <span className={`font-medium ${formData.remaining < 0 ? 'text-red-600' : ''}`}>
                ${Number(formData.remaining).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save Purchase
        </button>
      </div>
    </form>
  );
};

export default PurchaseForm;