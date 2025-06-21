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

## Mobile Preview Mode

The app includes a **phone view** toggle for quickly testing mobile layouts in the browser. When enabled, a simulated phone frame constrains the width to about 390&nbsp;px and adds a shadowed border. All content remains scrollable within this frame.

Use the smartphone button in the header to enter mobile preview. The button includes an accessible label and changes color when active. While in phone view, a floating monitor icon appears inside the frame so you can return to the regular web layout at any time.

Developers can maintain this feature by editing the `.mobile-preview` CSS block in `src/index.css` and the toggle logic in `src/App.js` and `src/components/Header.js`. Keep interactive elements sized for touch input and avoid fixed widths that could cause horizontal clipping.

## Deployment

1. Ensure your `.env` file defines secrets like `STRIPE_SECRET_KEY` without committing it to Git.
2. Set the start script to `node server/index.js`.
3. Deploy to a Node-friendly host such as Render or Railway. Use `npm install` as the build command and **`npm start`** (or `node server/index.js`) as the start command. If using Render, be sure the start command begins with `node` so the server runs correctly.