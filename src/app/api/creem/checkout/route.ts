import { NextRequest, NextResponse } from 'next/server';
import { CREEM_CONFIG } from '@/lib/creem';
import { getCreemProductId } from '@/lib/creem-products';

// 创建 CREEM 结账会话
export async function POST(req: NextRequest) {
  try {
    const { items, customer, orderId } = await req.json();

    console.log('CREEM Checkout Request:', { 
      items: items.map((i: any) => ({ id: i.id, name: i.name, qty: i.quantity })),
      customer,
      orderId,
      hasApiKey: !!CREEM_CONFIG.API_KEY
    });

    if (!CREEM_CONFIG.API_KEY) {
      return NextResponse.json(
        { error: 'CREEM not configured' },
        { status: 500 }
      );
    }

    // 获取第一个商品的 CREEM Product ID
    // CREEM 一个结账只能对应一个产品，如果有多个商品，使用第一个
    const firstItem = items[0];
    const productId = getCreemProductId(firstItem.id);

    if (!productId) {
      return NextResponse.json(
        { error: `Product not configured in CREEM: ${firstItem.name}. Please contact support.` },
        { status: 500 }
      );
    }

    console.log('Using CREEM Product ID:', productId);

    // 创建结账会话 - 使用 CREEM 标准格式
    const checkoutData: any = {
      product_id: productId,
      request_id: orderId,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?order_id=${orderId}&payment=creem`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?canceled=true`,
      metadata: {
        order_id: orderId,
        customer_name: customer.name,
        customer_email: customer.email,
        items: JSON.stringify(items.map((i: any) => ({ id: i.id, name: i.name, qty: i.quantity }))),
      },
    };

    // 如果有多个数量
    if (firstItem.quantity > 1) {
      checkoutData.units = firstItem.quantity;
    }

    // 如果提供了客户邮箱
    if (customer.email) {
      checkoutData.customer = { email: customer.email };
    }

    console.log('Checkout payload:', checkoutData);

    const response = await fetch(`${CREEM_CONFIG.API_BASE}/v1/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CREEM_CONFIG.API_KEY,
      },
      body: JSON.stringify(checkoutData),
    });

    console.log('CREEM API Response:', { status: response.status });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CREEM API Error:', errorText);
      
      let errorMessage = 'Failed to create checkout session';
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorText;
      } catch {
        errorMessage = errorText || `HTTP ${response.status}`;
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }

    const session = await response.json();
    console.log('Checkout created:', { id: session.id, url: session.checkout_url });

    return NextResponse.json({
      sessionId: session.id,
      checkoutUrl: session.checkout_url,
    });
  } catch (error: any) {
    console.error('CREEM checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout' },
      { status: 500 }
    );
  }
}