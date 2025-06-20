// Utility to generate a PromptPay QR code image
const promptpay = require('promptpay-qr');
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
    // Generate the PromptPay payload using the provided library
    const payload = promptpay.generatePayload(recipient, { amount: Number(amount) });
    // Convert the payload into a QR code image represented as a Data URL
    const url = await QRCode.toDataURL(payload, { errorCorrectionLevel: 'M' });
    return url;
  } catch (err) {
    throw new Error('Could not generate PromptPay QR: ' + err.message);
  }
}

module.exports = { generatePromptPayQR };
