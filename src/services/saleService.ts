import api from './api';

export interface SaleItem {
  id?: number;
  sale_id?: number;
  product_id: number;
  batch_number?: string;
  expiry_date?: string;
  quantity: number;
  unit_price: number;
  discount: number;
  line_total: number;
  product?: any;
}

export interface Sale {
  id?: number;
  customer_id?: number;
  created_by?: number;
  invoice_number?: string;
  sub_total: number;
  discount: number;
  tax: number;
  total: number;
  paid: number;
  remaining: number;
  status: 'paid' | 'partial' | 'credit';
  payment_method?: string;
  sale_date?: string;
  branch_id?: number;
  items: SaleItem[];
  customer?: any;
  createdBy?: any;
}

export interface SaleFormData {
  customer_id?: number;
  created_by?: number;
  invoice_number?: string;
  sub_total: number;
  discount: number;
  tax: number;
  total: number;
  paid: number;
  remaining: number;
  status: 'paid' | 'partial' | 'credit';
  payment_method?: string;
  sale_date?: string;
  branch_id?: number;
  items: SaleItem[];
}

export const getSales = async (): Promise<Sale[]> => {
  const response = await api.get<Sale[]>('/sales');
  return response.data;
};

export const getSale = async (id: number): Promise<Sale> => {
  const response = await api.get<Sale>(`/sales/${id}`);
  return response.data;
};

export const createSale = async (data: SaleFormData): Promise<Sale> => {
  const response = await api.post<Sale>('/sales', data);
  return response.data;
};

export const updateSale = async (id: number, data: SaleFormData): Promise<Sale> => {
  const response = await api.put<Sale>(`/sales/${id}`, data);
  return response.data;
};

export const deleteSale = async (id: number): Promise<void> => {
  await api.delete(`/sales/${id}`);
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
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  
  const response = await api.get<SalesReport>(`/reports/sales?${params.toString()}`);
  return response.data;
};

export const getPurchasesReport = async (startDate?: string, endDate?: string): Promise<PurchasesReport> => {
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  
  const response = await api.get<PurchasesReport>(`/reports/purchases?${params.toString()}`);
  return response.data;
};

export const getInventoryReport = async (lowStockThreshold?: number): Promise<InventoryReport> => {
  const params = new URLSearchParams();
  if (lowStockThreshold) params.append('low_stock_threshold', lowStockThreshold.toString());
  
  const response = await api.get<InventoryReport>(`/reports/inventory?${params.toString()}`);
  return response.data;
};