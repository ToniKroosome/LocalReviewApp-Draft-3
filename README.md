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

Set `STRIPE_SECRET_KEY` in your environment with your Stripe test secret key. The frontend expects the server at `http://localhost:4242`.
 
# LocalReviewApp-Draft-3

## Generating PromptPay QR Codes

Visit `/pay?recipient=YOUR_ID&amount=100.50` while the server is running to see the QR code.
