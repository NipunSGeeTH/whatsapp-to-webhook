const { getClient } = require('./client');
const config = require('../config');
const axios = require('axios');

/**
 * Forward incoming message to external webhook
 */
const forwardMessageToWebhook = async (message) => {
  if (!config.webhook.forwardUrl) {
    return;
  }

  try {
    const payload = {
      from: message.from,
      body: message.body,
      timestamp: message.timestamp,
      type: message.type,
      hasMedia: message.hasMedia,
    };

    await axios.post(config.webhook.forwardUrl, payload, {
      timeout: 5000,
    });
    
    console.log('Message forwarded to webhook:', config.webhook.forwardUrl);
  } catch (error) {
    console.error('Error forwarding message to webhook:', error.message);
  }
};

/**
 * Setup WhatsApp event listeners
 */
const setupEventListeners = () => {
  const client = getClient();

  // Listen for incoming messages
  client.on('message', (msg) => {
    console.log('MESSAGE RECEIVED:', {
      from: msg.from,
      body: msg.body,
      timestamp: msg.timestamp,
    });

    // Forward message to external webhook
    forwardMessageToWebhook(msg);

    // Emit custom event for message received
    client.emit('message:received', msg);
  });

  // Listen for message acknowledgments
  client.on('message_ack', (msg, ack) => {
    console.log('MESSAGE ACK:', {
      from: msg.from,
      ack: ack,
    });
  });

  // Listen for group changes
  client.on('group_join', (notification) => {
    console.log('GROUP JOIN:', notification);
  });

  // Listen for message state changes
  client.on('message_create', (msg) => {
    console.log('MESSAGE CREATED:', {
      from: msg.from,
      body: msg.body,
    });
  });

  console.log('Event listeners setup complete');
};

/**
 * Register custom message handler
 */
const registerMessageHandler = (handler) => {
  const client = getClient();
  client.on('message:received', handler);
};

module.exports = {
  setupEventListeners,
  registerMessageHandler,
};
