import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import PromptPayQRModal from './PromptPayQRModal';

const stripePromise = loadStripe('pk_test_placeholder');

const PaymentPage = ({ onBack, onComplete }) => {
  const [credits, setCredits] = useState(10);
  // selected payment method: stripe, paypal or promptpay
  const [method, setMethod] = useState('stripe');
  const [completed, setCompleted] = useState(false);
  // control visibility of PromptPay QR modal
  const [showQRModal, setShowQRModal] = useState(false);

  // hardcoded PromptPay recipient info
  const PROMPTPAY_ID = '0812345678';
  const PROMPTPAY_ACCOUNT = 'Demo Shop';

  const handleStripeCheckout = async () => {
    try {
      const res = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: credits }),
      });
      const data = await res.json();
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (err) {
      console.error('Stripe checkout error', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100">
      <header className="bg-gray-900/90 backdrop-blur-xl shadow-2xl border-b border-gray-800/50 p-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
            <ArrowLeft size={20} />
            <span className="font-semibold">Back</span>
          </button>
          <h2 className="text-xl font-bold text-gray-100 ml-2">Buy Credits</h2>
        </div>
      </header>
      <main className="max-w-3xl mx-auto p-4 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Credit Amount</label>
          <input
            type="number"
            value={credits}
            onChange={e => setCredits(Number(e.target.value))}
            className="w-32 px-3 py-2 rounded-md bg-gray-800 text-sm focus:outline-none"
            min="1"
          />
        </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="stripe"
                  checked={method === 'stripe'}
                  onChange={() => setMethod('stripe')}
                />
                Stripe
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="paypal"
                  checked={method === 'paypal'}
                  onChange={() => setMethod('paypal')}
                />
                PayPal
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="promptpay"
                  checked={method === 'promptpay'}
                  onChange={() => setMethod('promptpay')}
                />
                PromptPay
              </label>
            </div>
          </div>
          {method === 'stripe' && (
            <div className="space-y-2">
              <button
                onClick={handleStripeCheckout}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Pay with Card
              </button>
            </div>
          )}
        {method === 'paypal' && (
          <div className="space-y-2">
            <PayPalScriptProvider options={{ 'client-id': 'test' }}>
              <PayPalButtons
                style={{ layout: 'vertical' }}
                createOrder={(data, actions) =>
                  actions.order.create({
                    purchase_units: [
                      { amount: { value: credits.toFixed(2) } },
                    ],
                  })
                }
                onApprove={() => {
                  setCompleted(true);
                  if (onComplete) onComplete(credits);
                }}
              />
            </PayPalScriptProvider>
          </div>
        )}

        {/* When PromptPay is chosen, open a modal showing the QR code */}
        {method === 'promptpay' && (
          <div className="space-y-2">
            <button
              onClick={() => setShowQRModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Pay with PromptPay
            </button>
          </div>
        )}

        <PromptPayQRModal
          open={showQRModal}
          onClose={() => setShowQRModal(false)}
          promptPayId={PROMPTPAY_ID}
          accountName={PROMPTPAY_ACCOUNT}
          amount={credits}
          onComplete={() => {
            setShowQRModal(false);
            setCompleted(true);
            if (onComplete) onComplete(credits);
          }}
        />



        {completed && <p className="text-green-400">Payment successful!</p>}
      </main>
    </div>
  );
};

export default PaymentPage;
