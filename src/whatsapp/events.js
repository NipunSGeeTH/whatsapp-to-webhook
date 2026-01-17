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
    // Determine if it's a group message
    const isGroupChat = message.from.includes('@g.us');
    const isBroadcast = message.broadcast || message.from.includes('@broadcast');

    const payload = {
      // Basic Message Info
      messageId: message.id?.id || message.id,
      from: message.from,
      fromNumber: message.from.replace('@c.us', '').replace('@g.us', '').replace('@broadcast', ''),
      to: message.to,
      author: message.author || null,
      
      // Message Content
      body: message.body,
      type: message.type,
      
      // Timestamps & Status
      timestamp: message.timestamp,
      ack: message.ack,
      
      // Chat Type Information
      chat: {
        id: message.from,
        isGroup: isGroupChat,
        isBroadcast: isBroadcast,
        isPrivate: !isGroupChat && !isBroadcast,
      },

      // Message Metadata
      fromMe: message.fromMe,
      hasMedia: message.hasMedia,
      hasQuotedMsg: message.hasQuotedMsg,
      hasReaction: message.hasReaction,
      hasGroupMentions: message.groupMentions && message.groupMentions.length > 0,
      
      // Group Specific
      participant: message.participant || null,
      groupMentions: message.groupMentions || [],
      mentionedIds: message.mentionedIds || [],
      
      // Message Properties
      isForwarded: message.isForwarded,
      isGif: message.isGif,
      isStarred: message.isStarred,
      isStatus: message.isStatus,
      isEphemeral: message.isEphemeral,
      
      // Media & Attachments
      mediaKey: message.mediaKey || null,
      duration: message.duration || null,
      
      // Forwarding Info
      forwardingScore: message.forwardingScore || 0,
      
      // Links & vCards
      links: message.links || [],
      vCards: message.vCards || [],
      
      // Location (if location message)
      location: message.location || null,
      
      // Group Invites
      inviteV4: message.inviteV4 || null,
      
      // Orders & Tokens
      orderId: message.orderId || null,
      token: message.token || null,
      
      // Device Type
      deviceType: message.deviceType || null,
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
