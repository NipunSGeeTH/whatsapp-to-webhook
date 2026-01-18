const express = require('express');
const config = require('../config');
const { sendTextMessage, sendMediaMessage } = require('../whatsapp/messageService');
const { isClientReady, getQRCode } = require('../whatsapp/client');

const router = express.Router();

/**
 * Get QR Code
 */
router.get('/qr', (req, res) => {
  const qrCode = getQRCode();
  if (qrCode) {
    res.json({
      success: true,
      qrCode: qrCode,
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'QR code not available. Either already authenticated or not yet generated.',
      ready: isClientReady(),
    });
  }
});

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    whatsappReady: isClientReady(),
  });
});

/**
 * Verify webhook token (for security)
 */
router.get('/webhook', (req, res) => {
  const token = req.query.verify_token;
  const challenge = req.query.challenge;

  if (token === config.webhook.verifyToken) {
    res.status(200).send(challenge);
  } else {
    res.status(403).send('Verification token mismatch');
  }
});

/**
 * Receive webhook events
 */
router.post('/webhook', async (req, res) => {
  try {
    const { phoneNumber, message, mediaUrl, messageType } = req.body;

    // Validate required fields
    if (!phoneNumber || !message) {
      return res.status(400).json({
        error: 'phoneNumber and message are required',
      });
    }

    // Check if client is ready
    if (!isClientReady()) {
      return res.status(503).json({
        error: 'WhatsApp client not ready',
        details: 'Client is still initializing. Please wait and try again.',
      });
    }

    let response;

    // Send message based on type
    if (messageType === 'media' && mediaUrl) {
      response = await sendMediaMessage(phoneNumber, mediaUrl, message);
    } else {
      response = await sendTextMessage(phoneNumber, message);
    }

    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      data: response,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      error: 'Failed to send message',
      details: error.message,
    });
  }
});

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
