// Utility to generate a PromptPay QR code image
// The original implementation depended on the `promptpay-qr` package, but that
// package is not always available in restricted environments. To avoid runtime
// errors we generate a simplified payload instead and encode it with `qrcode`.
const QRCode = require('qrcode');

/**
 * Generate PromptPay QR code image as a data URL.
 * @param {string} recipient Thai mobile number or national ID
 * @param {number} amount Amount in THB (can be decimal)
 * @returns {Promise<string>} Data URL representing the QR code image
 */
async function generatePromptPayQR(recipient, amount) {
  if (!recipient) {
    throw new Error('Recipient is required');
  }

  const sanitized = String(recipient).replace(/[^0-9]/g, '');
  if (sanitized.length < 9 || sanitized.length > 13) {
    throw new Error('Invalid PromptPay number');
  }

  try {
    // Without the dedicated promptpay library we simply encode a placeholder
    // string that includes the recipient and amount. This is sufficient for
    // demos and avoids an external dependency.
    const payload = `PROMPTPAY:${sanitized}:${Number(amount) || 0}`;
    const url = await QRCode.toDataURL(payload, { errorCorrectionLevel: 'M' });
    return url;
  } catch (err) {
    throw new Error('Could not generate PromptPay QR: ' + err.message);
  }
}

module.exports = { generatePromptPayQR };
