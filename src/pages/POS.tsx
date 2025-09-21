import React, { useState, useRef, useEffect } from 'react';
import type { Product } from '../services/productService';

interface CartItem extends Product {
  cartQuantity: number;
}

const POS: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Focus the barcode input when the component mounts
  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, []);

  // Handle barcode scanning
  const handleBarcodeScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // In a real app, you would search for the product by barcode
      console.log('Scanning barcode:', searchTerm);
      // Reset the search term
      setSearchTerm('');
    }
  };

  // Add product to cart
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, cartQuantity: 1 }];
      }
    });
  };

  // Update cart item quantity
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, cartQuantity: quantity } : item))
    );
  };

  // Remove item from cart
  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Calculate cart totals
  const calculateTotals = () => {
    const subtotal = cart.reduce(
      (sum, item) => sum + parseFloat(item.selling_price) * item.cartQuantity,
      0
    );
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals();

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Point of Sale</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {/* Barcode Scanner Input */}
          <div className="mb-6">
            <label htmlFor="barcode" className="block text-sm font-medium text-gray-700">
              Scan Barcode
            </label>
            <input
              ref={barcodeInputRef}
              type="text"
              name="barcode"
              id="barcode"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleBarcodeScan}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Scan barcode or enter manually"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product List */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Products</h3>
                </div>
                <ul className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <li key={product.id}>
                      <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            ${product.selling_price} - Qty: {product.quantity}
                          </p>
                        </div>
                        <button
                          onClick={() => addToCart(product)}
                          className="ml-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Add
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Cart */}
            <div>
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Cart</h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  {cart.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Cart is empty</p>
                  ) : (
                    <div className="space-y-4">
                      <ul className="divide-y divide-gray-200">
                        {cart.map((item) => (
                          <li key={item.id} className="py-4">
                            <div className="flex justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-500">${item.selling_price}</p>
                              </div>
                              <div className="flex items-center">
                                <button
                                  onClick={() => updateQuantity(item.id, item.cartQuantity - 1)}
                                  className="rounded-md border border-gray-300 px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                  -
                                </button>
                                <span className="mx-2 text-sm">{item.cartQuantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}
                                  className="rounded-md border border-gray-300 px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                  +
                                </button>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="ml-2 text-red-600 hover:text-red-900"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>

                      <div className="border-t border-gray-200 pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tax</span>
                          <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-base font-medium">
                          <span>Total</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="mt-6">
                        <button
                          type="button"
                          className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Checkout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;