import { NextRequest, NextResponse } from 'next/server';
import { CREEM_CONFIG } from '@/lib/creem';

// CREEM Webhook 处理
export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const signature = req.headers.get('x-creem-signature');

    // TODO: 验证签名（需要实现签名验证逻辑）
    // const isValid = verifySignature(payload, signature, CREEM_CONFIG.WEBHOOK_SECRET);
    // if (!isValid) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    const event = JSON.parse(payload);

    switch (event.type) {
      case 'checkout.session.completed':
        // 支付成功
        await handlePaymentSuccess(event.data);
        break;

      case 'checkout.session.expired':
        // 支付过期
        await handlePaymentExpired(event.data);
        break;

      case 'refund.created':
        // 退款处理
        await handleRefund(event.data);
        break;

      default:
        console.log('Unhandled CREEM event:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('CREEM webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(data: any) {
  const { metadata, amount_total, id } = data;
  
  console.log('Payment success:', {
    orderId: metadata?.order_id,
    amount: amount_total,
    creemSessionId: id,
  });

  // TODO: 更新订单状态为已支付
  // 可以调用数据库更新逻辑
}

async function handlePaymentExpired(data: any) {
  const { metadata } = data;
  console.log('Payment expired:', metadata?.order_id);
  // TODO: 更新订单状态为取消
}

async function handleRefund(data: any) {
  const { metadata } = data;
  console.log('Refund processed:', metadata?.order_id);
  // TODO: 更新订单状态为已退款
}