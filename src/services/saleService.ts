import api from './api';
import type { Product } from './productService';

export interface SaleItem {
  id?: number;
  product_id: number;
  product?: Product;
  quantity: number;
  unit_price: number;
  discount: number;
  line_total: number;
}

export interface Sale {
  id?: number;
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
  customer?: {
    id: number;
    name: string;
  };
}

export interface SaleFormData {
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
  items: Omit<SaleItem, 'id' | 'product'>[];
}

// Get all sales
export const getSales = async (): Promise<Sale[]> => {
  try {
    const response = await api.get<Sale[]>('/sales');
    return response.data;
  } catch (error) {
    console.error('Error fetching sales:', error);
    throw error;
  }
};

// Get sale by ID
export const getSale = async (id: number): Promise<Sale> => {
  try {
    const response = await api.get<Sale>(`/sales/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching sale with ID ${id}:`, error);
    throw error;
  }
};

// Create new sale
export const createSale = async (data: SaleFormData): Promise<Sale> => {
  try {
    const response = await api.post<Sale>('/sales', data);
    return response.data;
  } catch (error) {
    console.error('Error creating sale:', error);
    throw error;
  }
};

// Update sale
export const updateSale = async (id: number, data: SaleFormData): Promise<Sale> => {
  try {
    const response = await api.put<Sale>(`/sales/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating sale with ID ${id}:`, error);
    throw error;
  }
};

// Delete sale
export const deleteSale = async (id: number): Promise<void> => {
  try {
    await api.delete(`/sales/${id}`);
  } catch (error) {
    console.error(`Error deleting sale with ID ${id}:`, error);
    throw error;
  }
};

// Report endpoints
export interface SalesReport {
  sales: Sale[];
  summary: {
    total_revenue: number;
    total_transactions: number;
  };
}

export interface PurchasesReport {
  purchases: any[];
  summary: {
    total_purchases: number;
    total_transactions: number;
  };
}

export interface InventoryReport {
  products: any[];
  low_stock_products: any[];
  summary: {
    total_products: number;
    total_low_stock_products: number;
  };
}

export const getSalesReport = async (startDate?: string, endDate?: string): Promise<SalesReport> => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const response = await api.get<SalesReport>(`/reports/sales?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sales report:', error);
    throw error;
  }
};

export const getPurchasesReport = async (startDate?: string, endDate?: string): Promise<PurchasesReport> => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const response = await api.get<PurchasesReport>(`/reports/purchases?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching purchases report:', error);
    throw error;
  }
};

export const getInventoryReport = async (lowStockThreshold?: number): Promise<InventoryReport> => {
  try {
    const params = new URLSearchParams();
    if (lowStockThreshold) params.append('low_stock_threshold', lowStockThreshold.toString());
    
    const response = await api.get<InventoryReport>(`/reports/inventory?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching inventory report:', error);
    throw error;
  }
};