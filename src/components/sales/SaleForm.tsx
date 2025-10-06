import React, { useState, useEffect } from 'react';
import { getProduct } from '../../services/productService';
import type { Product } from '../../services/productService';

interface SaleItem {
  product_id: number;
  product_name?: string;
  quantity: number;
  unit_price: number;
  discount: number;
  line_total: number;
}

interface SaleFormData {
  customer_id?: number;
  invoice_number?: string;
  sale_date: string;
  sub_total: number;
  discount: number;
  tax: number;
  total: number;
  paid: number;
  remaining: number;
  status: 'paid' | 'unpaid' | 'partial';
  items: SaleItem[];
}

interface SaleFormProps {
  onSubmit: (data: SaleFormData) => void;
  onCancel: () => void;
  initialData?: SaleFormData;
}

const SaleForm: React.FC<SaleFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState<SaleFormData>({
    customer_id: undefined,
    invoice_number: '',
    sale_date: new Date().toISOString().split('T')[0],
    sub_total: 0,
    discount: 0,
    tax: 0,
    total: 0,
    paid: 0,
    remaining: 0,
    status: 'unpaid',
    items: [],
  });

  const [items, setItems] = useState<SaleItem[]>(initialData?.items || []);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // In a real app, you would fetch products from the API
        // const productData = await getAllProducts();
        // setProducts(productData);
        setLoadingProducts(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setItems(initialData.items);
    }
  }, [initialData]);

  const calculateTotals = (items: SaleItem[]) => {
    const subTotal = items.reduce((sum, item) => sum + item.line_total, 0);
    const total = subTotal - formData.discount + formData.tax;
    const remaining = total - formData.paid;
    
    return {
      sub_total: parseFloat(subTotal.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      remaining: parseFloat(remaining.toFixed(2)),
    };
  };

  const handleItemChange = (index: number, field: keyof SaleItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    // If product changes, update product name and unit price
    if (field === 'product_id') {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index].product_name = product.name;
        newItems[index].unit_price = product.selling_price;
      }
    }

    // If quantity or unit_price or discount changes, recalculate line total
    if (field === 'quantity' || field === 'unit_price' || field === 'discount') {
      const item = newItems[index];
      const lineTotal = item.quantity * item.unit_price - item.discount;
      newItems[index].line_total = parseFloat(lineTotal.toFixed(2));
    }

    setItems(newItems);
    const totals = calculateTotals(newItems);
    setFormData(prev => ({
      ...prev,
      ...totals,
      remaining: totals.total - prev.paid,
    }));
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        product_id: 0,
        product_name: '',
        quantity: 1,
        unit_price: 0,
        discount: 0,
        line_total: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    const totals = calculateTotals(newItems);
    setFormData(prev => ({
      ...prev,
      ...totals,
      remaining: totals.total - prev.paid,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      items,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'paid') {
      const paid = parseFloat(value) || 0;
      const remaining = formData.total - paid;
      const status = paid >= formData.total ? 'paid' : paid > 0 ? 'partial' : 'unpaid';
      
      setFormData(prev => ({
        ...prev,
        [name]: paid,
        remaining: parseFloat(remaining.toFixed(2)),
        status,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'customer_id' ? (value ? parseInt(value) : undefined) : value,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="customer_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Customer
          </label>
          <input
            type="number"
            id="customer_id"
            name="customer_id"
            value={formData.customer_id || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Customer ID (optional)"
          />
        </div>
        
        <div>
          <label htmlFor="invoice_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Invoice Number
          </label>
          <input
            type="text"
            id="invoice_number"
            name="invoice_number"
            value={formData.invoice_number || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Invoice number"
          />
        </div>
        
        <div>
          <label htmlFor="sale_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sale Date
          </label>
          <input
            type="date"
            id="sale_date"
            name="sale_date"
            value={formData.sale_date}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partial</option>
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
        
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No items added yet</p>
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
                    Unit Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Discount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={item.product_id}
                        onChange={(e) => handleItemChange(index, 'product_id', parseInt(e.target.value))}
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      >
                        <option value="">Select Product</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unit_price}
                        onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                        className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.discount}
                        onChange={(e) => handleItemChange(index, 'discount', parseFloat(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ${item.line_total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
        <div></div>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
            <span className="font-medium">${formData.sub_total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Discount:</span>
            <span className="font-medium">-${formData.discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Tax:</span>
            <span className="font-medium">${formData.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
            <span className="text-lg font-medium text-gray-900 dark:text-white">Total:</span>
            <span className="text-lg font-medium text-gray-900 dark:text-white">${formData.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Paid:</span>
            <input
              type="number"
              step="0.01"
              min="0"
              name="paid"
              value={formData.paid}
              onChange={handleInputChange}
              className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
            <span className="text-lg font-medium text-gray-900 dark:text-white">Remaining:</span>
            <span className={`text-lg font-medium ${formData.remaining < 0 ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
              ${formData.remaining.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save Sale
        </button>
      </div>
    </form>
  );
};

export default SaleForm;