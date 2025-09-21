import api from './api';

export interface Product {
  id: number;
  category_id: number | null;
  branch_id: number | null;
  name: string;
  sku: string | null;
  barcode: string | null;
  description: string | null;
  cost_price: string;
  selling_price: string;
  quantity: string;
  reorder_threshold: string;
  track_expiry: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ProductFormData {
  category_id?: number;
  branch_id?: number;
  name: string;
  sku?: string;
  barcode?: string;
  description?: string;
  cost_price: string;
  selling_price: string;
  quantity: string;
  reorder_threshold: string;
  track_expiry: boolean;
}

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>('/products');
  return response.data;
};

export const getProduct = async (id: number): Promise<Product> => {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
};

export const createProduct = async (data: ProductFormData): Promise<Product> => {
  const response = await api.post<Product>('/products', data);
  return response.data;
};

export const updateProduct = async (id: number, data: ProductFormData): Promise<Product> => {
  const response = await api.put<Product>(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/products/${id}`);
};