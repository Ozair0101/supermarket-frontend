import React, { useState, useRef, useEffect } from 'react';
import { Search, Barcode, Plus, Minus, Trash2, Printer, CreditCard, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts } from '../services/productService';
import { createSale } from '../services/saleService';
import type { Product as ApiProduct } from '../services/productService';

interface PosProduct {
  id: number;
  name: string;
  price: number;
  barcode: string;
  category: string;
}

interface CartItem extends PosProduct {
  quantity: number;
}

const POS: React.FC = () => {
  const [products, setProducts] = useState<PosProduct[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Focus barcode input on component mount
  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      // Convert API products to the format we need for the POS
      const formattedProducts = data.map(product => ({
        id: product.id,
        name: product.name,
        price: parseFloat(product.selling_price),
        barcode: product.barcode || '',
        category: '', // We might need to fetch categories separately
      }));
      setProducts(formattedProducts);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
      setLoading(false);
    }
  };

  // Handle barcode scanning
  const handleBarcodeScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const product = products.find(p => p.barcode === barcodeInput);
      if (product) {
        addToCart(product);
        setBarcodeInput('');
      }
    }
  };

  // Add product to cart
  const addToCart = (product: PosProduct) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // Update item quantity
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  // Filter products based on search term
  const filteredProducts = products.filter(
    product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.barcode && product.barcode.includes(searchTerm))
  );

  // Handle manual product selection
  const handleProductSelect = (product: PosProduct) => {
    addToCart(product);
  };

  // Handle payment
  const handlePayment = async () => {
    if (cart.length === 0) return;
    
    try {
      // Create sale data
      const saleData = {
        sale_date: new Date().toISOString().split('T')[0],
        sub_total: subtotal,
        discount: 0,
        tax: tax,
        total: total,
        paid: total, // For simplicity, assume full payment
        remaining: 0,
        status: 'paid' as const,
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          discount: 0,
          line_total: item.price * item.quantity
        }))
      };
      
      // Save the sale
      await createSale(saleData);
      
      // Clear the cart
      setCart([]);
      alert(`Payment processed successfully: $${Number(total).toFixed(2)}`);
    } catch (err) {
      console.error('Error processing payment:', err);
      alert('Failed to process payment. Please try again.');
    }
  };

  // Print receipt
  const handlePrintReceipt = () => {
    window.print();
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Point of Sale</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Scan items or search to add them to the cart
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mt-6 flex-1">
        {/* Left Column - Product Search and List */}
        <div className="lg:w-2/3 flex flex-col">
          {/* Barcode Scanner Input */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
            <label htmlFor="barcode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Scan Barcode
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Barcode className="h-5 w-5 text-gray-400" />
              </div>
              <input
                ref={barcodeInputRef}
                type="text"
                id="barcode"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={handleBarcodeScan}
                placeholder="Scan barcode or enter manually"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 dark:text-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Search Products */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
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
                placeholder="Search by name or barcode"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 dark:text-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Product List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex-1 overflow-hidden">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Products
            </h2>
            <div className="overflow-y-auto h-[calc(100%-2rem)]">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <motion.li
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-3"
                    >
                      <button
                        onClick={() => handleProductSelect(product)}
                        className="w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 py-1 transition-colors"
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {product.category} • {product.barcode}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              ${Number(product.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column - Cart */}
        <div className="lg:w-1/3 flex flex-col">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex-1 flex flex-col">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Shopping Cart
            </h2>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto mb-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <ShoppingCart className="h-12 w-12 mb-2" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  <AnimatePresence>
                    {cart.map((item) => (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="py-3"
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              ${Number(item.price).toFixed(2)} × {item.quantity}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              ${(Number(item.price) * item.quantity).toFixed(2)}
                            </p>
                            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-2 text-sm">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Cart Summary */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium">${Number(subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tax (8%)</span>
                  <span className="font-medium">${Number(tax).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-medium border-t border-gray-200 dark:border-gray-700 pt-2">
                  <span>Total</span>
                  <span>${Number(total).toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={handlePayment}
                  disabled={cart.length === 0}
                  className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Process Payment
                </button>
                <button
                  onClick={handlePrintReceipt}
                  disabled={cart.length === 0}
                  className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Printer className="mr-2 h-5 w-5" />
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;