import api from './api';

export interface Customer {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

export const getCustomers = async (): Promise<Customer[]> => {
  const response = await api.get<Customer[]>('/customers');
  return response.data;
};

export const getCustomer = async (id: number): Promise<Customer> => {
  const response = await api.get<Customer>(`/customers/${id}`);
  return response.data;
};

export const createCustomer = async (data: Omit<Customer, 'id'>): Promise<Customer> => {
  const response = await api.post<Customer>('/customers', data);
  return response.data;
};

export const updateCustomer = async (id: number, data: Omit<Customer, 'id'>): Promise<Customer> => {
  const response = await api.put<Customer>(`/customers/${id}`, data);
  return response.data;
};

export const deleteCustomer = async (id: number): Promise<void> => {
  await api.delete(`/customers/${id}`);
};