import { NextRequest, NextResponse } from "next/server";

// PayPal API configuration
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API = process.env.NODE_ENV === 'production' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

async function getPayPalAccessToken() {
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });
  
  const data = await response.json();
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const { items, shipping, total, customer, country } = await req.json();

    const accessToken = await getPayPalAccessToken();

    // Build items for PayPal
    const paypalItems = items.map((item: any) => ({
      name: item.product.name.slice(0, 127), // PayPal limit
      description: item.product.description.slice(0, 127),
      quantity: item.quantity.toString(),
      unit_amount: {
        currency_code: "EUR",
        value: item.product.price.toFixed(2),
      },
      category: "PHYSICAL_GOODS",
    }));

    // Add shipping as separate item if applicable
    if (shipping > 0) {
      paypalItems.push({
        name: "Shipping",
        description: `Shipping to ${country}`,
        quantity: "1",
        unit_amount: {
          currency_code: "EUR",
          value: shipping.toFixed(2),
        },
        category: "SHIPPING",
      });
    }

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
                value: items.reduce((sum: number, item: any) => 
                  sum + (item.product.price * item.quantity), 0
                ).toFixed(2),
              },
              shipping: {
                currency_code: "EUR",
                value: shipping.toFixed(2),
              },
            },
          },
          items: paypalItems,
          shipping: {
            name: {
              full_name: `${customer.firstName} ${customer.lastName}`,
            },
            address: {
              address_line_1: customer.address,
              admin_area_2: customer.city,
              postal_code: customer.postalCode,
              country_code: country,
            },
          },
        },
      ],
      application_context: {
        brand_name: "Vintage Watch Co.",
        landing_page: "BILLING",
        shipping_preference: "SET_PROVIDED_ADDRESS",
        user_action: "PAY_NOW",
        return_url: `${process.env.NEXT_PUBLIC_URL}/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout`,
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

    if (order.id) {
      return NextResponse.json({ 
        orderId: order.id,
        approvalUrl: order.links.find((link: any) => link.rel === "approve")?.href
      });
    } else {
      console.error("PayPal order creation failed:", order);
      return NextResponse.json(
        { error: "Failed to create PayPal order" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("PayPal error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
