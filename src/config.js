// Configuration file for WhatsApp bot
module.exports = {
  // Webhook configuration
  webhook: {
    port: process.env.WEBHOOK_PORT || 3000,
    path: process.env.WEBHOOK_PATH || '/webhook',
    verifyToken: process.env.VERIFY_TOKEN || 'your-verify-token',
    // External webhook to forward incoming messages
    forwardUrl: process.env.FORWARD_WEBHOOK_URL || null,
  },

  // WhatsApp Web.js configuration
  whatsapp: {
    sessionName: 'whatsapp-session',
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};
