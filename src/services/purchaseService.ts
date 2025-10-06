import api from './api';

export interface PurchaseItem {
  id?: number;
  purchase_id?: number;
  product_id: number;
  batch_number?: string;
  expiry_date?: string;
  quantity: number;
  unit_cost: number;
  discount: number;
  line_total: number;
  product?: any;
}

export interface Purchase {
  id?: number;
  supplier_id: number;
  created_by?: number;
  invoice_number?: string;
  sub_total: number;
  discount: number;
  tax: number;
  total: number;
  paid: number;
  remaining: number;
  status: 'paid' | 'partial' | 'credit';
  purchase_date?: string;
  branch_id?: number;
  items: PurchaseItem[];
  supplier?: any;
  createdBy?: any;
}

export interface PurchaseFormData {
  supplier_id: number;
  created_by?: number;
  invoice_number?: string;
  sub_total: number;
  discount: number;
  tax: number;
  total: number;
  paid: number;
  remaining: number;
  status: 'paid' | 'partial' | 'credit';
  purchase_date?: string;
  branch_id?: number;
  items: PurchaseItem[];
}

export const getPurchases = async (): Promise<Purchase[]> => {
  try {
    const response = await api.get<Purchase[]>('/purchases');
    return response.data;
  } catch (error) {
    console.error('Error fetching purchases:', error);
    throw error;
  }
};

export const getPurchase = async (id: number): Promise<Purchase> => {
  try {
    const response = await api.get<Purchase>(`/purchases/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching purchase with id ${id}:`, error);
    throw error;
  }
};

export const createPurchase = async (data: PurchaseFormData): Promise<Purchase> => {
  try {
    const response = await api.post<Purchase>('/purchases', data);
    return response.data;
  } catch (error) {
    console.error('Error creating purchase:', error);
    throw error;
  }
};

export const updatePurchase = async (id: number, data: PurchaseFormData): Promise<Purchase> => {
  try {
    const response = await api.put<Purchase>(`/purchases/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating purchase with id ${id}:`, error);
    throw error;
  }
};

export const deletePurchase = async (id: number): Promise<void> => {
  try {
    await api.delete(`/purchases/${id}`);
  } catch (error) {
    console.error(`Error deleting purchase with id ${id}:`, error);
    throw error;
  }
};