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
  try {
    const response = await api.get<Supplier[]>('/suppliers');
    return response.data;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw error;
  }
};

export const getSupplier = async (id: number): Promise<Supplier> => {
  try {
    const response = await api.get<Supplier>(`/suppliers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching supplier with id ${id}:`, error);
    throw error;
  }
};

export const createSupplier = async (data: SupplierFormData): Promise<Supplier> => {
  try {
    const response = await api.post<Supplier>('/suppliers', data);
    return response.data;
  } catch (error) {
    console.error('Error creating supplier:', error);
    throw error;
  }
};

export const updateSupplier = async (id: number, data: SupplierFormData): Promise<Supplier> => {
  try {
    const response = await api.put<Supplier>(`/suppliers/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating supplier with id ${id}:`, error);
    throw error;
  }
};

export const deleteSupplier = async (id: number): Promise<void> => {
  try {
    await api.delete(`/suppliers/${id}`);
  } catch (error) {
    console.error(`Error deleting supplier with id ${id}:`, error);
    throw error;
  }
};