export const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const api = (path: string) => `${API_BASE}${path}`;
