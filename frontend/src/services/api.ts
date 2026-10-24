import axios from 'axios';
import type { QueryResult, SOPUpdate, QuestionCluster, Stats } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const queryAPI = {
  ask: async (question: string, userId?: string): Promise<QueryResult> => {
    const { data } = await api.post('/query', { question, userId });
    return data;
  },

  getLowConfidence: async (threshold: number = 70) => {
    const { data } = await api.get(`/query/low-confidence?threshold=${threshold}`);
    return data;
  },
};

export const sopAPI = {
  getAll: async (): Promise<SOPUpdate[]> => {
    const { data } = await api.get('/sop');
    return data;
  },

  getByStatus: async () => {
    const { data } = await api.get('/sop/by-status');
    return data;
  },

  update: async (id: number, updates: Partial<SOPUpdate>): Promise<SOPUpdate> => {
    const { data } = await api.patch(`/sop/${id}`, updates);
    return data;
  },
};

export const analyticsAPI = {
  getClusters: async (weekStart?: string): Promise<QuestionCluster[]> => {
    const params = weekStart ? `?weekStart=${weekStart}` : '';
    const { data } = await api.get(`/analytics/clusters${params}`);
    return data;
  },

  triggerClustering: async (weekStart?: string) => {
    const { data } = await api.post('/analytics/cluster', { weekStart });
    return data;
  },

  getStats: async (): Promise<Stats> => {
    const { data } = await api.get('/analytics/stats');
    return data;
  },
};

export const documentAPI = {
  upload: async (file: File, title?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);

    const { data } = await api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  getAll: async () => {
    const { data } = await api.get('/documents');
    return data;
  },

  delete: async (id: number) => {
    const { data } = await api.delete(`/documents/${id}`);
    return data;
  },
};
