const { getClient } = require('./client');

/**
 * Send a text message to a WhatsApp number
 * @param {string} phoneNumber - Phone number with country code (e.g., '919876543210')
 * @param {string} message - Message text to send
 * @returns {Promise<object>} - Message object
 */
const sendTextMessage = async (phoneNumber, message) => {
  try {
    const client = getClient();
    const chatId = `${phoneNumber}@c.us`;
    const response = await client.sendMessage(chatId, message);
    console.log(`Message sent to ${phoneNumber}`);
    return response;
  } catch (error) {
    console.error(`Error sending message to ${phoneNumber}:`, error);
    throw error;
  }
};

/**
 * Send a media message (image, video, audio, document)
 * @param {string} phoneNumber - Phone number with country code
 * @param {string} mediaPath - Path to media file or URL
 * @param {string} caption - Optional caption for the media
 * @returns {Promise<object>} - Message object
 */
const sendMediaMessage = async (phoneNumber, mediaPath, caption = '') => {
  try {
    const client = getClient();
    const chatId = `${phoneNumber}@c.us`;
    const MessageMedia = require('whatsapp-web.js').MessageMedia;

    const media = MessageMedia.fromFilePath(mediaPath);
    const response = await client.sendMessage(chatId, media, {
      caption: caption,
    });
    console.log(`Media message sent to ${phoneNumber}`);
    return response;
  } catch (error) {
    console.error(`Error sending media to ${phoneNumber}:`, error);
    throw error;
  }
};

/**
 * Send a message to a group
 * @param {string} groupId - Group chat ID
 * @param {string} message - Message text
 * @returns {Promise<object>} - Message object
 */
const sendGroupMessage = async (groupId, message) => {
  try {
    const client = getClient();
    const response = await client.sendMessage(groupId, message);
    console.log(`Group message sent to ${groupId}`);
    return response;
  } catch (error) {
    console.error(`Error sending group message:`, error);
    throw error;
  }
};

/**
 * Send a message to multiple numbers
 * @param {string[]} phoneNumbers - Array of phone numbers
 * @param {string} message - Message text
 * @returns {Promise<object[]>} - Array of message objects
 */
const sendBulkMessages = async (phoneNumbers, message) => {
  try {
    const results = [];
    for (const phoneNumber of phoneNumbers) {
      const response = await sendTextMessage(phoneNumber, message);
      results.push(response);
    }
    return results;
  } catch (error) {
    console.error('Error sending bulk messages:', error);
    throw error;
  }
};

module.exports = {
  sendTextMessage,
  sendMediaMessage,
  sendGroupMessage,
  sendBulkMessages,
};
