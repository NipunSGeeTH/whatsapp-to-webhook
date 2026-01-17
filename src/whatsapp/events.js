const { getClient } = require('./client');

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
