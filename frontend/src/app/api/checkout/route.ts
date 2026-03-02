import { NextRequest, NextResponse } from "next/server";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || "AbHq-PZViSEb8tZPjsJ2RNb9sbl0BN71KzTuJ8OQmLsXSDofOfC3PkvBHRhM5o2aYHkV7JLb5vytFtIm";
const PAYPAL_SECRET = process.env.PAYPAL_SECRET || "EL3MwL692rUqx5_k6TwEemCV7OV4GFsNbluhsZGzMqdb_UR_Q_G_8DiKC1vcIe9T2jePtlrPZpAWoRHH";
const PAYPAL_API = 'https://api-m.sandbox.paypal.com';

async function getPayPalAccessToken() {
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Auth failed: ${error}`);
  }
  
  const data = await response.json();
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const { items, shipping, total, customer, country } = await req.json();

    const accessToken = await getPayPalAccessToken();

    // Calculate item total
    const itemTotal = items.reduce((sum: number, item: any) => 
      sum + (item.product.price * item.quantity), 0
    );

    // Simplified order without shipping address (PayPal will collect it)
    const orderData = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "EUR",
            value: total.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "EUR",
                value: itemTotal.toFixed(2),
              },
              shipping: {
                currency_code: "EUR",
                value: shipping.toFixed(2),
              },
            },
          },
          items: items.map((item: any) => ({
            name: item.product.name.slice(0, 127),
            quantity: item.quantity.toString(),
            unit_amount: {
              currency_code: "EUR",
              value: item.product.price.toFixed(2),
            },
            category: "PHYSICAL_GOODS",
          })),
        },
      ],
      application_context: {
        brand_name: "Vintage Watch Co.",
        landing_page: "LOGIN",
        user_action: "PAY_NOW",
        shipping_preference: "GET_FROM_FILE", // Let PayPal collect shipping
        return_url: `https://vintage-watch-co.vercel.app/success`,
        cancel_url: `https://vintage-watch-co.vercel.app/checkout`,
      },
    };

    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderData),
    });

    const order = await response.json();

    if (!response.ok) {
      console.error("PayPal order error:", order);
      return NextResponse.json(
        { error: "PayPal error", details: order },
        { status: 500 }
      );
    }

    const approvalUrl = order.links?.find((link: any) => link.rel === "approve")?.href;
    
    if (!approvalUrl) {
      return NextResponse.json(
        { error: "No approval URL" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      orderId: order.id,
      approvalUrl
    });

  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
