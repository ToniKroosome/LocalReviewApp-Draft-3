## Payment Setup

Shop owners can edit the PayPal address used for receiving payments directly on the shop detail page. After entering an address, click **Send Verification Code** to simulate sending an email with a one-time code. Entering the displayed code marks the address as verified and ready to receive funds.

## Buying Credits

Use the **Buy Credits** button in the header to open the payment page. Select Stripe or PayPal and follow the prompts to complete payment.

## Running the Stripe demo server

A minimal Express server is provided in `server/index.js` to create Stripe Checkout sessions.

```bash
npm install
node server/index.js
```

Set your Stripe API keys before running the server:

```
export REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
export STRIPE_SECRET_KEY=sk_test_your_key
```

Without real keys the demo will fall back to placeholders and payments won't succeed.

## Mobile App Packaging

See [docs/mobile-app.md](docs/mobile-app.md) for steps to wrap the app using Capacitor and publish to Android and iOS. A starter `capacitor.config.ts` is included for convenience.