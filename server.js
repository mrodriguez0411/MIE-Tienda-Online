import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig } from 'mercadopago';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Configura dotenv
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de MercadoPago
const mercadopago = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN 
});

// Ruta de prueba
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Resto de tu código...

export default app;

// Solo inicia el servidor si se ejecuta directamente
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}