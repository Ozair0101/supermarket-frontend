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
  try {
    const response = await api.get<Customer[]>('/customers');
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

export const getCustomer = async (id: number): Promise<Customer> => {
  try {
    const response = await api.get<Customer>(`/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching customer with id ${id}:`, error);
    throw error;
  }
};

export const createCustomer = async (data: Omit<Customer, 'id'>): Promise<Customer> => {
  try {
    const response = await api.post<Customer>('/customers', data);
    return response.data;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

export const updateCustomer = async (id: number, data: Omit<Customer, 'id'>): Promise<Customer> => {
  try {
    const response = await api.put<Customer>(`/customers/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating customer with id ${id}:`, error);
    throw error;
  }
};

export const deleteCustomer = async (id: number): Promise<void> => {
  try {
    await api.delete(`/customers/${id}`);
  } catch (error) {
    console.error(`Error deleting customer with id ${id}:`, error);
    throw error;
  }
};