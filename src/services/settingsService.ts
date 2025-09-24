import api from './api';
import type { AxiosPromise } from 'axios';

export interface Setting {
  id?: number;
  key: string;
  value: string;
  created_at?: string;
  updated_at?: string;
}

export const getSettings = async (): Promise<Setting[]> => {
  const response = await api.get<Setting[]>('/settings');
  return response.data;
};

export const getSetting = async (id: number): Promise<Setting> => {
  const response = await api.get<Setting>(`/settings/${id}`);
  return response.data;
};

export const createSetting = async (setting: Omit<Setting, 'id'>): Promise<Setting> => {
  const response = await api.post<Setting>('/settings', setting);
  return response.data;
};

export const updateSetting = async (id: number, setting: Partial<Setting>): Promise<Setting> => {
  const response = await api.put<Setting>(`/settings/${id}`, setting);
  return response.data;
};

export const deleteSetting = async (id: number): Promise<void> => {
  await api.delete(`/settings/${id}`);
};