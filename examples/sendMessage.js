// Example: Send message to a number
const { getClient, initializeWhatsApp } = require('./src/whatsapp/client');
const { sendTextMessage } = require('./src/whatsapp/messageService');

const example = async () => {
  try {
    // Initialize client
    await initializeWhatsApp();

    // Send a message
    const phoneNumber = '919876543210'; // Replace with actual number
    const message = 'Hello! This is a test message from WhatsApp bot.';

    await sendTextMessage(phoneNumber, message);
    console.log('Message sent successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
};

// Uncomment to run example
// example();
