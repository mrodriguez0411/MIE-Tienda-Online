'use client';

import { initMercadoPago } from '@mercadopago/sdk-react';
import { useEffect, useState, useRef } from 'react';

interface MercadoPagoButtonProps {
  total: number;
  onPaymentError: (error: any) => void;
}

export const MercadoPagoButton = ({
  total,
  onPaymentError,
}: MercadoPagoButtonProps) => {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const scriptLoaded = useRef(false);

  // Inicializar MercadoPago con tu public key
  useEffect(() => {
    let isMounted = true;

    const initializeMercadoPago = async () => {
      try {
        const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY ||
                         process.env.VITE_MERCADOPAGO_PUBLIC_KEY;
        
        if (!publicKey) {
          throw new Error('MercadoPago public key is not configured. Please check your .env file.');
        }

        console.log('Initializing MercadoPago with public key:', '***' + publicKey.slice(-4));
        
        await initMercadoPago(publicKey, {
          locale: 'es-AR',
        });
        
        if (isMounted) {
          console.log('MercadoPago initialized successfully');
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error initializing MercadoPago:', error);
        if (isMounted) {
          onPaymentError(error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeMercadoPago();

    return () => {
      isMounted = false;
    };
  }, [onPaymentError]);

  // Create payment preference when component mounts
  useEffect(() => {
    if (!isInitialized || !total) return;

    let isMounted = true;
    setIsLoading(true);

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
        
        if (isMounted) {
          setPreferenceId(id);
        }
      } catch (error) {
        console.error('Error creating payment preference:', error);
        if (isMounted) {
          onPaymentError(error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    createPreference();

    return () => {
      isMounted = false;
    };
  }, [isInitialized, total, onPaymentError]);

  // Efecto para cargar el script de MercadoPago
  useEffect(() => {
    if (!preferenceId || scriptLoaded.current) return;

    const loadMercadoPagoScript = () => {
      if (scriptLoaded.current) return;
      
      // Crear script de MercadoPago
      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.setAttribute('data-preference-id', preferenceId);
      script.setAttribute('data-button-label', 'Pagar con MercadoPago');
      script.setAttribute('data-elements', 'true');
      script.async = true;
      
      script.onload = () => {
        scriptLoaded.current = true;
      };
      
      // Limpiar cualquier script anterior
      const existingScript = document.querySelector('script[src*="mercadopago"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      
      // Agregar el script al final del body
      document.body.appendChild(script);
      
      return () => {
        // Limpiar el script cuando el componente se desmonte
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    };

    loadMercadoPagoScript();

    return () => {
      scriptLoaded.current = false;
    };
  }, [preferenceId]);

  if (isLoading) {
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
    </div>
  );
};
