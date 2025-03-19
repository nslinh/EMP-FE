export const env = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  NODE_ENV: import.meta.env.MODE,
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
} as const; 