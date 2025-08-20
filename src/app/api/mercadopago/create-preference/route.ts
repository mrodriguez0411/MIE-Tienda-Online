import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configura el cliente de MercadoPago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  options: {
    timeout: 5000,
    idempotencyKey: 'MIE-TIENDA-ORDER',
  },
});

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    // Crea un objeto de preferencia
    const preference = new Preference(client);

    // Configura la preferencia de pago
    const result = await preference.create({
      body: {
        items: items.map((item: any) => ({
          id: item.id || 'default-id',
          title: item.title || 'Producto',
          quantity: item.quantity || 1,
          unit_price: Number(item.unit_price) || 0,
          currency_id: 'ARS',
        })),
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
        },
        auto_return: 'approved',
        binary_mode: true,
      },
    });

    return NextResponse.json({ id: result.id });
  } catch (error) {
    console.error('Error creating MercadoPago preference:', error);
    return NextResponse.json(
      { error: 'Error al crear la preferencia de pago' },
      { status: 500 }
    );
  }
}
