import api from './api';

export interface Category {
  id: number;
  name: string;
  slug: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CategoryFormData {
  name: string;
  slug?: string;
  description?: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>('/categories');
  return response.data;
};

export const getCategory = async (id: number): Promise<Category> => {
  const response = await api.get<Category>(`/categories/${id}`);
  return response.data;
};

export const createCategory = async (data: CategoryFormData): Promise<Category> => {
  const response = await api.post<Category>('/categories', data);
  return response.data;
};

export const updateCategory = async (id: number, data: CategoryFormData): Promise<Category> => {
  const response = await api.put<Category>(`/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/categories/${id}`);
};