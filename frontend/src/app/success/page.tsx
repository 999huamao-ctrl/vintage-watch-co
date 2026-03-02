import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-stone-50 py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-serif mb-4">Thank You for Your Order!</h1>
        
        <p className="text-stone-600 mb-8">
          We've received your order and will send you a confirmation email shortly.
          Your vintage watch will be carefully packaged and shipped within 1-2 business days.
        </p>

        <div className="bg-white p-6 rounded-xl mb-8">
          <h2 className="font-semibold mb-4">What happens next?</h2>
          <ul className="text-left text-stone-600 space-y-2">
            <li>📧 You'll receive an order confirmation email</li>
            <li>📦 We'll pack and ship your watch within 1-2 business days</li>
            <li>🚚 Tracking information will be sent via email</li>
            <li>✨ Your watch will arrive in 9-15 business days</li>
          </ul>
        </div>

        <Link
          href="/"
          className="inline-block bg-stone-900 text-white px-8 py-3 rounded-lg hover:bg-stone-800"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
