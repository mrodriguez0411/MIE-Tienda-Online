import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Configura dotenv
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración de CORS
const allowedOrigins = [
  'http://localhost:3000', // Next.js/otros
  'http://localhost:5173', // Vite por defecto
];

const corsOptions = {
  origin: (origin, callback) => {
    // Permitir requests sin origin (Postman/cURL) o si está en la lista
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS bloqueado para el origen: ${origin}`));
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Configuración de MercadoPago
console.log('Inicializando MercadoPago con ACCESS_TOKEN:', process.env.MERCADOPAGO_ACCESS_TOKEN ? '***' + process.env.MERCADOPAGO_ACCESS_TOKEN.slice(-4) : 'No definido');

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  console.error('ERROR: MERCADOPAGO_ACCESS_TOKEN no está definido en las variables de entorno');
  process.exit(1);
}

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

// Inicializar el cliente de preferencias
const preference = new Preference(client);
console.log('Cliente de MercadoPago inicializado correctamente');

// Ruta raíz
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Bienvenido a la API de MIE-Tienda',
    endpoints: {
      health: '/health',
      createPreference: '/mercadopago/create-preference (POST)'
    }
  });
});

// Ruta de prueba
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Endpoint para crear preferencia de pago
app.post('/mercadopago/create-preference', async (req, res) => {
  console.log('Solicitud recibida en /mercadopago/create-preference');
  console.log('Cuerpo de la solicitud:', req.body);
  
  try {
    const { items, total } = req.body;
    
    // Crear preferencia (usar 5173 por defecto porque el front corre con Vite)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5173';
    console.log('Usando URL base:', baseUrl);
    
    const preferenceData = {
      items: items.map(item => ({
        title: item.title,
        unit_price: Number(item.unit_price),
        quantity: Number(item.quantity),
        currency_id: 'ARS',
      })),
      back_urls: {
        success: `${baseUrl}/checkout/success`,
        failure: `${baseUrl}/checkout/failure`,
        pending: `${baseUrl}/checkout/pending`,
      },
      // Only set auto_return if we have a success URL
      ...(baseUrl && baseUrl.includes('localhost') ? {} : { auto_return: 'approved' }),
      binary_mode: true,
    };
    
    console.log('Preference data:', JSON.stringify(preferenceData, null, 2));

    console.log('Creando preferencia con datos:', preferenceData);
    const response = await preference.create({ body: preferenceData });
    console.log('Preferencia creada con éxito:', response);
    res.json({ id: response.id });
  } catch (error) {
    console.error('Error creating preference (raw):', error);
    try {
      // Intentar extraer detalles que provee el SDK de MercadoPago
      const mpDetails = {
        message: error?.message,
        name: error?.name,
        status: error?.status,
        error: error?.error,
        cause: error?.cause,
        validation_errors: error?.validation_errors,
        response: error?.response?.data || error?.response,
      };
      console.error('Error details (parsed):', JSON.stringify(mpDetails, null, 2));
    } catch (e) {
      console.error('Error al parsear detalles del error:', e);
    }
    res.status(500).json({ 
      error: 'Error al crear preferencia de pago',
      details: error?.message || 'unknown',
    });
  }
});

export default app;

// Solo inicia el servidor si se ejecuta directamente
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}