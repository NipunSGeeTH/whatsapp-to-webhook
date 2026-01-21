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
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-background-networking',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-breakpad',
        '--disable-component-extensions-with-background-pages',
        '--disable-extensions',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection',
        '--disable-renderer-backgrounding',
        '--enable-features=NetworkService,NetworkServiceInProcess',
        '--force-color-profile=srgb',
        '--hide-scrollbars',
        '--metrics-recording-only',
        '--mute-audio',
        '--disable-software-rasterizer',
        '--disable-sync',
        '--disable-default-apps',
        '--disable-translate',
        '--disable-profile-default-protections',
        '--disable-default-extension',
        '--disable-component-update',
        '--single-process',
      ],
    },
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};
