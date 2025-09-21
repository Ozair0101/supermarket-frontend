import api from './api';

export interface Supplier {
  id: number;
  name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  remaining_balance: string;
  created_at: string;
  updated_at: string;
}

export interface SupplierFormData {
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  remaining_balance: string;
}

export const getSuppliers = async (): Promise<Supplier[]> => {
  const response = await api.get<Supplier[]>('/suppliers');
  return response.data;
};

export const getSupplier = async (id: number): Promise<Supplier> => {
  const response = await api.get<Supplier>(`/suppliers/${id}`);
  return response.data;
};

export const createSupplier = async (data: SupplierFormData): Promise<Supplier> => {
  const response = await api.post<Supplier>('/suppliers', data);
  return response.data;
};

export const updateSupplier = async (id: number, data: SupplierFormData): Promise<Supplier> => {
  const response = await api.put<Supplier>(`/suppliers/${id}`, data);
  return response.data;
};

export const deleteSupplier = async (id: number): Promise<void> => {
  await api.delete(`/suppliers/${id}`);
};