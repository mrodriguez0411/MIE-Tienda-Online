import { useEffect } from 'react';

export const TestEnv = () => {
  useEffect(() => {
    console.log('Environment Variables:', {
      VITE_MERCADOPAGO_PUBLIC_KEY: import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY,
      VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
      MODE: import.meta.env.MODE,
      DEV: import.meta.env.DEV,
      PROD: import.meta.env.PROD,
    });
  }, []);

  return null; // This component doesn't render anything
};
