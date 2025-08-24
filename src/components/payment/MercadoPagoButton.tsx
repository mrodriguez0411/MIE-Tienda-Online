'use client';

import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { useEffect, useState } from 'react';

interface MercadoPagoButtonProps {
  total: number;
  onPaymentSuccess: () => void;
  onPaymentError: (error: any) => void;
}

export const MercadoPagoButton = ({
  total,
  onPaymentSuccess,
  onPaymentError,
}: MercadoPagoButtonProps) => {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Inicializar MercadoPago con tu public key
  useEffect(() => {
    const initializeMercadoPago = async () => {
      try {
        // En Vite, las variables expuestas al cliente deben empezar con VITE_
        // Asegúrate de tener VITE_MERCADOPAGO_PUBLIC_KEY en tu .env
        await initMercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || '', {
          locale: 'es-AR',
        });
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

  const handlePaymentSuccess = () => {
    onPaymentSuccess();
  };

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
      <Wallet
        initialization={{ preferenceId }}
        onReady={() => console.log('MercadoPago Wallet ready')}
        onSubmit={() => console.log('Submit')}
        onError={(error) => {
          console.error('MercadoPago error:', error);
          onPaymentError(error);
        }}
        onReadyForSaving={() => console.log('Ready for saving')}
      />
    </div>
  );
};
