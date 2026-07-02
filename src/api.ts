import axios from 'axios';
import { getToken } from './auth';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) return fallback;

  const data: unknown = error.response?.data;

  if (data && typeof data === 'object') {
    const { detail, message } = data as { detail?: string; message?: string };
    if (detail) return detail;
    if (message) return message;
  }

  // Some validation errors come back as a plain-text Spring exception dump
  // instead of a ProblemDetail JSON body. Pull the human-readable part out of it.
  if (typeof data === 'string' && data.trim()) {
    const matches = [...data.matchAll(/default message \[([^\]]*)\]/g)];
    if (matches.length > 0) return matches[matches.length - 1][1];
    return data;
  }

  return fallback;
}

export default api;
