import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, Package } from 'lucide-react';
import { getProducts } from '../services/productService';
import type { Product } from '../services/productService';

interface StockProduct extends Product {
  total_quantity: number;
  category?: {
    id: number;
    name: string;
  };
}

const Stock: React.FC = () => {
  const [products, setProducts] = useState<StockProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<StockProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(
      product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Fetch all products (both with and without inventory)
      const data = await getProducts();
      
      // Debug: Log the data structure to see what we're receiving
      console.log('Product data:', data);
      
      // Use the backend's total_quantity directly instead of recalculating
      const productsWithQuantity = data.map(product => ({
        ...product,
        // Use the backend calculated total_quantity, with a fallback to 0
        total_quantity: typeof (product as any).total_quantity === 'number' ? (product as any).total_quantity : 0
      }));
      
      setProducts(productsWithQuantity);
      setFilteredProducts(productsWithQuantity);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900 rounded-lg p-4">
        <p className="text-red-800 dark:text-red-200">{error}</p>
        <button 
          onClick={fetchProducts}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stock Inventory</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View all products and their current stock levels
        </p>
      </div>

      {/* Search Products */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mt-6">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Search Products
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or SKU"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 dark:text-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mt-6 flex-1 overflow-hidden">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Stock Items
        </h2>
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No products found</p>
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
                    SKU
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    In Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProducts.map((product) => (
                  <tr 
                    key={product.id}
                    className={product.total_quantity < 5 && product.total_quantity > 0 ? 'bg-yellow-50 dark:bg-yellow-900/30' : ''}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {product.sku || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {product.category?.name || 'Uncategorized'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-semibold ${
                        product.total_quantity < 5 && product.total_quantity > 0
                          ? 'text-yellow-700 dark:text-yellow-300' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {isNaN(product.total_quantity) ? '0.00' : product.total_quantity.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.total_quantity <= 0 ? (
                          <>
                            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                            <span className="text-sm text-red-700 dark:text-red-300">
                              Out of Stock
                            </span>
                          </>
                        ) : product.total_quantity < (parseFloat(product.reorder_threshold) || 0) ? (
                          <>
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                            <span className="text-sm text-yellow-700 dark:text-yellow-300">
                              Low Stock
                            </span>
                          </>
                        ) : product.total_quantity < 5 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                            Low Quantity (&lt;5 items)
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            Normal
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stock;