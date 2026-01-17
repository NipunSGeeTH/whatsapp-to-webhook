const express = require('express');
const config = require('./config');
const { initializeWhatsApp, isClientReady } = require('./whatsapp/client');
const { setupEventListeners } = require('./whatsapp/events');
const webhookRoutes = require('./routes/webhook');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', webhookRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Initialize server
const startServer = async () => {
  try {
    console.log('Initializing WhatsApp client...');
    await initializeWhatsApp();

    console.log('Setting up event listeners...');
    setupEventListeners();

    const PORT = config.webhook.port;
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
      console.log(`Webhook path: ${config.webhook.path}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  const { disconnectClient } = require('./whatsapp/client');
  await disconnectClient();
  process.exit(0);
});

if (require.main === module) {
  startServer();
}

module.exports = app;
