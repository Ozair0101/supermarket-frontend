import api from './api';

export interface PurchaseItem {
  id?: number;
  purchase_id?: number;
  product_id: number;
  barcode?: string;
  batch_number?: string;
  expiry_date?: string;
  quantity: number;
  unit_cost: number;
  selling_price: number;
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
    // Ensure numeric fields are proper numbers
    return response.data.map(purchase => ({
      ...purchase,
      sub_total: typeof purchase.sub_total === 'string' ? parseFloat(purchase.sub_total) : purchase.sub_total,
      discount: typeof purchase.discount === 'string' ? parseFloat(purchase.discount) : purchase.discount,
      tax: typeof purchase.tax === 'string' ? parseFloat(purchase.tax) : purchase.tax,
      total: typeof purchase.total === 'string' ? parseFloat(purchase.total) : purchase.total,
      paid: typeof purchase.paid === 'string' ? parseFloat(purchase.paid) : purchase.paid,
      remaining: typeof purchase.remaining === 'string' ? parseFloat(purchase.remaining) : purchase.remaining
    }));
  } catch (error) {
    console.error('Error fetching purchases:', error);
    throw error;
  }
};

export const getPurchase = async (id: number): Promise<Purchase> => {
  try {
    const response = await api.get<Purchase>(`/purchases/${id}`);
    // Ensure numeric fields are proper numbers
    return {
      ...response.data,
      sub_total: typeof response.data.sub_total === 'string' ? parseFloat(response.data.sub_total) : response.data.sub_total,
      discount: typeof response.data.discount === 'string' ? parseFloat(response.data.discount) : response.data.discount,
      tax: typeof response.data.tax === 'string' ? parseFloat(response.data.tax) : response.data.tax,
      total: typeof response.data.total === 'string' ? parseFloat(response.data.total) : response.data.total,
      paid: typeof response.data.paid === 'string' ? parseFloat(response.data.paid) : response.data.paid,
      remaining: typeof response.data.remaining === 'string' ? parseFloat(response.data.remaining) : response.data.remaining
    };
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