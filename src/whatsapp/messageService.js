const { getClient, isClientReady } = require('./client');
const config = require('../config');
const axios = require('axios');

/**
 * Send webhook notification about message sent
 */
const sendSendWebhookNotification = async (messageData, success = true, error = null) => {
  if (!config.webhook.forwardUrl) {
    return;
  }

  try {
    const payload = {
      event: 'message:sent',
      success: success,
      timestamp: new Date().toISOString(),
      clientReady: isClientReady(),
      message: messageData,
      ...(error && { error: error }),
    };

    await axios.post(config.webhook.forwardUrl, payload, {
      timeout: 5000,
    });
  } catch (err) {
    console.error('Error sending webhook notification:', err.message);
  }
};

/**
 * Send a text message to a WhatsApp number
 * @param {string} phoneNumber - Phone number with country code (e.g., '919876543210')
 * @param {string} message - Message text to send
 * @param {object} options - Optional message send options
 * @returns {Promise<object>} - Detailed message response
 */
const sendTextMessage = async (phoneNumber, message, options = {}) => {
  try {
    const client = getClient();
    
    // Format the chat ID
    const chatId = phoneNumber.includes('@') ? phoneNumber : `${phoneNumber}@c.us`;
    
    console.log(`Attempting to send message to: ${chatId}`);
    console.log(`Message: ${message}`);

    // Send with sendSeen disabled to avoid markedUnread error
    const response = await client.sendMessage(chatId, message, {
      sendSeen: false,  // Disable to prevent markedUnread error
    });
    
    const responseData = {
      success: true,
      type: 'text',
      to: phoneNumber,
      chatId: chatId,
      
      // Message Details
      messageId: response.id?._serialized || response.id,
      body: response.body,
      timestamp: response.timestamp,
      fromMe: response.fromMe,
      
      // Timestamps
      sentAt: new Date().toISOString(),
      
      // Client Status
      clientReady: isClientReady(),
    };

    console.log(`Message sent to ${phoneNumber}`);
    
    // Webhook notification disabled - only forward incoming messages
    // await sendSendWebhookNotification(responseData);
    
    return responseData;
  } catch (error) {
    console.error(`Error sending message to ${phoneNumber}:`, error.message);
    
    const errorData = {
      success: false,
      type: 'text',
      to: phoneNumber,
      clientReady: isClientReady(),
      sentAt: new Date().toISOString(),
      errorMessage: error.message,
    };
    
    // Webhook notification disabled - only forward incoming messages
    // await sendSendWebhookNotification(errorData, false, error.message);
    throw error;
  }
};

/**
 * Send a media message (image, video, audio, document)
 * @param {string} phoneNumber - Phone number with country code
 * @param {string} mediaPath - Path to media file or URL
 * @param {string} caption - Optional caption for the media
 * @param {object} options - Optional message send options
 * @returns {Promise<object>} - Detailed message response
 */
const sendMediaMessage = async (phoneNumber, mediaPath, caption = '', options = {}) => {
  try {
    const client = getClient();
    const chatId = `${phoneNumber}@c.us`;
    const MessageMedia = require('whatsapp-web.js').MessageMedia;

    const media = MessageMedia.fromFilePath(mediaPath);
    
    // Prepare send options with all available features
    const sendOptions = {
      caption: caption,
      linkPreview: options.linkPreview !== false,
      sendAudioAsVoice: options.sendAudioAsVoice || false,
      sendVideoAsGif: options.sendVideoAsGif || false,
      sendMediaAsSticker: options.sendMediaAsSticker || false,
      sendMediaAsDocument: options.sendMediaAsDocument || false,
      sendMediaAsHd: options.sendMediaAsHd || true, // Default HD for images
      isViewOnce: options.isViewOnce || false,
      parseVCards: options.parseVCards !== false,
      sendSeen: options.sendSeen !== false,
      mentions: options.mentions || [],
      groupMentions: options.groupMentions || [],
      quotedMessageId: options.quotedMessageId || null,
      stickerAuthor: options.stickerAuthor || null,
      stickerName: options.stickerName || null,
      stickerCategories: options.stickerCategories || [],
      ignoreQuoteErrors: options.ignoreQuoteErrors !== false,
      waitUntilMsgSent: options.waitUntilMsgSent || false,
    };

    const response = await client.sendMessage(chatId, media, sendOptions);

    const responseData = {
      success: true,
      type: 'media',
      to: phoneNumber,
      chatId: chatId,
      isGroup: false,
      
      // Message Details
      messageId: response.id?.id || response.id,
      body: response.body || caption,
      mediaType: media.mimetype,
      hasMedia: true,
      timestamp: response.timestamp,
      
      // Status & Metadata
      ack: response.ack,
      fromMe: response.fromMe,
      deviceType: response.deviceType,
      
      // Send Options Used
      sendOptions: {
        caption: !!caption,
        sendMediaAsHd: sendOptions.sendMediaAsHd,
        sendMediaAsSticker: sendOptions.sendMediaAsSticker,
        sendMediaAsDocument: sendOptions.sendMediaAsDocument,
        sendVideoAsGif: sendOptions.sendVideoAsGif,
        sendAudioAsVoice: sendOptions.sendAudioAsVoice,
        isViewOnce: sendOptions.isViewOnce,
        mentions: sendOptions.mentions.length > 0,
        quotedMessage: !!sendOptions.quotedMessageId,
      },
      
      // Timestamps
      sentAt: new Date().toISOString(),
      
      // Client Status
      clientReady: isClientReady(),
    };

    console.log(`Media message sent to ${phoneNumber}`);
    
    // Webhook notification disabled - only forward incoming messages
    // await sendSendWebhookNotification(responseData);
    
    return responseData;
  } catch (error) {
    console.error(`Error sending media to ${phoneNumber}:`, error.message);
    
    const errorData = {
      success: false,
      type: 'media',
      to: phoneNumber,
      clientReady: isClientReady(),
      sentAt: new Date().toISOString(),
      errorMessage: error.message,
    };
    
    // Webhook notification disabled - only forward incoming messages
    // await sendSendWebhookNotification(errorData, false, error.message);
    throw error;
  }
};

/**
 * Send a message to a group
 * @param {string} groupId - Group chat ID
 * @param {string} message - Message text
 * @param {object} options - Optional message send options
 * @returns {Promise<object>} - Detailed message response
 */
// const sendGroupMessage = async (groupId, message, options = {}) => {
//   try {
//     const client = getClient();
    
//     // Prepare send options
//     const sendOptions = {
//       linkPreview: options.linkPreview !== false,
//       sendAudioAsVoice: options.sendAudioAsVoice || false,
//       sendVideoAsGif: options.sendVideoAsGif || false,
//       sendMediaAsSticker: options.sendMediaAsSticker || false,
//       sendMediaAsDocument: options.sendMediaAsDocument || false,
//       sendMediaAsHd: options.sendMediaAsHd || false,
//       isViewOnce: options.isViewOnce || false,
//       parseVCards: options.parseVCards !== false,
//       sendSeen: options.sendSeen !== false,
//       mentions: options.mentions || [],
//       groupMentions: options.groupMentions || [],
//       quotedMessageId: options.quotedMessageId || null,
//       invokedBotWid: options.invokedBotWid || null,
//       ignoreQuoteErrors: options.ignoreQuoteErrors !== false,
//       waitUntilMsgSent: options.waitUntilMsgSent || false,
//     };
    
//     const response = await client.sendMessage(groupId, message, sendOptions);

//     const responseData = {
//       success: true,
//       type: 'text',
//       groupId: groupId,
//       isGroup: true,
      
//       // Message Details
//       messageId: response.id?.id || response.id,
//       body: response.body,
//       timestamp: response.timestamp,
      
//       // Status & Metadata
//       ack: response.ack,
//       fromMe: response.fromMe,
//       hasMedia: response.hasMedia,
//       deviceType: response.deviceType,
      
//       // Send Options Used
//       sendOptions: {
//         linkPreview: sendOptions.linkPreview,
//         sendSeen: sendOptions.sendSeen,
//         mentions: sendOptions.mentions.length > 0,
//         groupMentions: sendOptions.groupMentions.length > 0,
//         quotedMessage: !!sendOptions.quotedMessageId,
//       },
      
//       // Timestamps
//       sentAt: new Date().toISOString(),
      
//       // Client Status
//       clientReady: isClientReady(),
//     };

//     console.log(`Group message sent to ${groupId}`);
    
//     // Send webhook notification if configured
//     await sendSendWebhookNotification(responseData);
    
//     return responseData;
//   } catch (error) {
//     console.error(`Error sending group message:`, error.message);
    
//     const errorData = {
//       success: false,
//       type: 'text',
//       groupId: groupId,
//       isGroup: true,
//       clientReady: isClientReady(),
//       sentAt: new Date().toISOString(),
//       errorMessage: error.message,
//     };
    
//     await sendSendWebhookNotification(errorData, false, error.message);
//     throw error;
//   }
// };

/**
 * Send a message to multiple numbers
 * @param {string[]} phoneNumbers - Array of phone numbers
 * @param {string} message - Message text
 * @returns {Promise<object[]>} - Array of message objects with detailed responses
 */
const sendBulkMessages = async (phoneNumbers, message) => {
  try {
    const results = [];
    for (const phoneNumber of phoneNumbers) {
      try {
        const response = await sendTextMessage(phoneNumber, message);
        results.push(response);
      } catch (error) {
        results.push({
          success: false,
          to: phoneNumber,
          errorMessage: error.message,
        });
      }
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
  sendBulkMessages,
  sendSendWebhookNotification,
};
