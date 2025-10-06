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
  try {
    const response = await api.get<Setting[]>('/settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

export const getSetting = async (id: number): Promise<Setting> => {
  try {
    const response = await api.get<Setting>(`/settings/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching setting with id ${id}:`, error);
    throw error;
  }
};

export const createSetting = async (setting: Omit<Setting, 'id'>): Promise<Setting> => {
  try {
    const response = await api.post<Setting>('/settings', setting);
    return response.data;
  } catch (error) {
    console.error('Error creating setting:', error);
    throw error;
  }
};

export const updateSetting = async (id: number, setting: Partial<Setting>): Promise<Setting> => {
  try {
    const response = await api.put<Setting>(`/settings/${id}`, setting);
    return response.data;
  } catch (error) {
    console.error(`Error updating setting with id ${id}:`, error);
    throw error;
  }
};

export const deleteSetting = async (id: number): Promise<void> => {
  try {
    await api.delete(`/settings/${id}`);
  } catch (error) {
    console.error(`Error deleting setting with id ${id}:`, error);
    throw error;
  }
};