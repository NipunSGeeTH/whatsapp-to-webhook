const express = require('express');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

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
    const PORT = config.webhook.port;
    
    // Start the server immediately
    app.listen(PORT, () => {
      console.log('\n========================================');
      console.log('✓ Server started successfully');
      console.log('========================================');
      console.log(`📌 Port: ${PORT}`);
      console.log(`🌐 Server URL: http://localhost:${PORT}`);
      console.log(`📱 QR Code URL: http://localhost:${PORT}/qr`);
      console.log(`🔗 Webhook Path: http://localhost:${PORT}${config.webhook.path}`);
      console.log(`💚 Health Check: http://localhost:${PORT}/health`);
      console.log('========================================\n');
    });

    // Initialize WhatsApp in background
    console.log('Initializing WhatsApp client...');
    initializeWhatsApp()
      .then(() => {
        console.log('Setting up event listeners...');
        setupEventListeners();
      })
      .catch((error) => {
        console.error('Failed to initialize WhatsApp client:', error);
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
