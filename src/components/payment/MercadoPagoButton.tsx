'use client';

import { initMercadoPago } from '@mercadopago/sdk-react';
import { useEffect, useState } from 'react';

interface MercadoPagoButtonProps {
  total: number;
  onPaymentError: (error: any) => void;
}

export const MercadoPagoButton = ({
  total,
  onPaymentError,
}: Omit<MercadoPagoButtonProps, 'onPaymentSuccess'>) => {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Inicializar MercadoPago con tu public key
  useEffect(() => {
    const initializeMercadoPago = async () => {
      try {
        const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY ||
                         process.env.VITE_MERCADOPAGO_PUBLIC_KEY ||
                         'YOUR_PUBLIC_KEY_HERE';
        
        if (!publicKey || publicKey === 'YOUR_PUBLIC_KEY_HERE') {
          throw new Error('MercadoPago public key is not configured. Please check your .env file.');
        }

        console.log('Initializing MercadoPago with public key:', publicKey ? '***' + publicKey.slice(-4) : 'Not found');
        
        await initMercadoPago(publicKey, {
          locale: 'es-AR',
        });
        console.log('MercadoPago initialized successfully');
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing MercadoPago:', error);
        onPaymentError(error);
      }
    };

    initializeMercadoPago();
  }, []);

  // Create payment preference when component mounts
  useEffect(() => {
    if (!isInitialized || !total) return;

    const createPreference = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
        const response = await fetch(`${apiBase}/mercadopago/create-preference`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: [
              {
                title: 'Compra en MIE-Tienda',
                unit_price: total,
                quantity: 1,
              },
            ],
            total: total
          }),
        });

        if (!response.ok) {
          throw new Error('Error al crear preferencia de pago');
        }

        const { id } = await response.json();
        setPreferenceId(id);
      } catch (error) {
        console.error('Error creating payment preference:', error);
        onPaymentError(error);
      }
    };

    createPreference();
  }, [isInitialized, total, onPaymentError]);

  if (!isInitialized || !preferenceId) {
    return (
      <button
        disabled
        className="w-full bg-gray-300 text-gray-600 py-2 px-4 rounded-md cursor-not-allowed"
      >
        Cargando pasarela de pago...
      </button>
    );
  }

  return (
    <div className="mt-4">
      <div id="wallet_container" className="w-full" />
      <script
        src="https://sdk.mercadopago.com/js/v2"
        data-preference-id={preferenceId}
        data-button-label="Pagar con MercadoPago"
        data-elements="true"
      />
    </div>
  );
};
