import React, { useState } from 'react';
import ProductList from '../components/products/ProductList';
import ProductForm from '../components/products/ProductForm';
import type { ProductFormData } from '../services/productService';

const Products: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  const handleCreateProduct = (data: ProductFormData) => {
    // Handle product creation
    console.log('Creating product:', data);
    setShowForm(false);
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Product
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {showForm ? (
            <div className="bg-white shadow sm:rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Product</h2>
              <ProductForm
                onSubmit={handleCreateProduct}
                onCancel={() => setShowForm(false)}
              />
            </div>
          ) : (
            <ProductList />
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;