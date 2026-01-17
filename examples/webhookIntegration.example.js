/**
 * Webhook Integration Test Examples
 * Test receiving and forwarding messages
 */

// ============================================
// SCENARIO 1: Message Forwarding
// ============================================
/*
When a message is received on WhatsApp, the app will:
1. Receive the message event
2. Extract all metadata
3. Download media if < 10MB
4. Forward to your webhook URL

Your webhook receives this payload:
*/
const incomingMessageExample = {
  messageId: "wamid.xxx",
  from: "+919876543210@c.us",
  fromNumber: "+919876543210",
  to: "+0987654321@c.us",
  author: null,
  body: "Hello! How are you?",
  type: "chat",
  timestamp: 1234567890,
  ack: 1,
  chat: {
    id: "+919876543210@c.us",
    isGroup: false,
    isBroadcast: false,
    isPrivate: true
  },
  fromMe: false,
  hasMedia: false,
  media: null,
  hasQuotedMsg: false,
  hasReaction: false,
  hasGroupMentions: false,
  participant: null,
  groupMentions: [],
  mentionedIds: [],
  isForwarded: false,
  isGif: false,
  isStarred: false,
  isStatus: false,
  isEphemeral: false,
  mediaKey: null,
  duration: null,
  forwardingScore: 0,
  links: [],
  vCards: [],
  location: null,
  inviteV4: null,
  orderId: null,
  token: null,
  deviceType: "web"
};

// ============================================
// SCENARIO 2: Group Message Received
// ============================================
const groupMessageExample = {
  messageId: "wamid.xxx",
  from: "123456789-1234567890@g.us",
  fromNumber: "123456789-1234567890",
  to: "123456789-1234567890@g.us",
  author: "+919876543210@c.us",
  body: "This is a group message",
  type: "chat",
  timestamp: 1234567890,
  chat: {
    id: "123456789-1234567890@g.us",
    isGroup: true,
    isBroadcast: false,
    isPrivate: false
  },
  fromMe: false,
  hasMedia: false,
  media: null,
  participant: "+919876543210@c.us", // Who sent it in the group
  mentionedIds: ["919876543211@c.us"], // If mentioned
  deviceType: "web"
};

// ============================================
// SCENARIO 3: Image Received
// ============================================
const imageMessageExample = {
  messageId: "wamid.xxx",
  from: "+919876543210@c.us",
  body: "Check this image!",
  type: "image",
  timestamp: 1234567890,
  chat: {
    id: "+919876543210@c.us",
    isGroup: false,
    isBroadcast: false,
    isPrivate: true
  },
  hasMedia: true,
  media: {
    mimetype: "image/jpeg",
    data: "iVBORw0KGgoAAAANSUhEUgAAAAUA...", // Base64 encoded
    filename: "photo.jpg",
    size: 2621440 // Bytes
  },
  deviceType: "web"
};

// ============================================
// SCENARIO 4: Message Sent Notification
// ============================================
const messageSentNotificationExample = {
  event: "message:sent",
  success: true,
  timestamp: "2026-01-17T12:30:45.123Z",
  clientReady: true,
  message: {
    success: true,
    type: "text",
    to: "919876543210",
    chatId: "919876543210@c.us",
    isGroup: false,
    messageId: "wamid.xxx",
    body: "Hello World!",
    timestamp: 1234567890,
    ack: 2, // 1=sent, 2=delivered, 3=read, etc.
    fromMe: true,
    hasMedia: false,
    deviceType: "web",
    sendOptions: {
      linkPreview: true,
      sendSeen: true,
      parseVCards: true,
      mentions: false,
      quotedMessage: false
    },
    sentAt: "2026-01-17T12:30:45.123Z",
    clientReady: true
  }
};

// ============================================
// SCENARIO 5: Message Send Failed Notification
// ============================================
const messageSentFailedExample = {
  event: "message:sent",
  success: false,
  timestamp: "2026-01-17T12:30:45.123Z",
  clientReady: false,
  message: {
    success: false,
    type: "text",
    to: "919876543210",
    clientReady: false,
    sentAt: "2026-01-17T12:30:45.123Z",
    errorMessage: "Chat not found"
  },
  error: "Chat not found"
};

// ============================================
// EXAMPLE: Express Webhook Handler
// ============================================
const express = require('express');
const app = express();

app.use(express.json());

// Webhook to receive messages
app.post('/webhook', async (req, res) => {
  try {
    const message = req.body;

    // Determine message type
    if (message.event === 'message:sent') {
      // Outgoing message notification
      if (message.success) {
        console.log('✓ Message sent successfully:', message.message.messageId);
      } else {
        console.error('✗ Message send failed:', message.message.errorMessage);
      }
      res.json({ status: 'logged' });
      return;
    }

    // Incoming message
    console.log('📨 Incoming message:');
    console.log('  From:', message.fromNumber);
    console.log('  Text:', message.body);
    console.log('  Type:', message.type);
    console.log('  Group:', message.chat?.isGroup);

    // Handle different message types
    if (message.type === 'text') {
      // Process text message
      handleTextMessage(message);
    } else if (message.type === 'image') {
      // Process image
      handleImageMessage(message);
    } else if (message.type === 'audio') {
      // Process audio
      handleAudioMessage(message);
    } else if (message.type === 'document') {
      // Process document
      handleDocumentMessage(message);
    }

    // Send success response
    res.json({
      status: 'received',
      messageId: message.messageId,
      processed: true
    });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Message handlers
function handleTextMessage(message) {
  const text = message.body.toLowerCase();

  if (text.includes('hello')) {
    // Reply to hello
    console.log('→ Replying with greeting...');
  } else if (text.includes('help')) {
    // Show help
    console.log('→ Sending help message...');
  } else if (text.includes('image')) {
    // Send image
    console.log('→ Sending image...');
  }
}

function handleImageMessage(message) {
  if (message.media) {
    console.log('→ Image received:', message.media.filename);
    console.log('  Size:', (message.media.size / 1024 / 1024).toFixed(2), 'MB');
    // Process image (e.g., save, analyze, etc.)
  }
}

function handleAudioMessage(message) {
  console.log('→ Audio message received');
  // Process audio (e.g., transcribe, etc.)
}

function handleDocumentMessage(message) {
  console.log('→ Document received:', message.body);
  // Process document
}

// ============================================
// ENVIRONMENT SETUP
// ============================================
const exampleEnv = `
# WhatsApp Bot Configuration

# Webhook Server
WEBHOOK_PORT=3000
WEBHOOK_PATH=/webhook
VERIFY_TOKEN=your-verify-token

# External Webhook URL (to forward messages)
# Replace with your actual webhook/API endpoint
FORWARD_WEBHOOK_URL=http://your-api.example.com/webhook

# Logging
LOG_LEVEL=info
`;

// ============================================
// TESTING WITH NGROK (for local development)
// ============================================
/*
1. Install ngrok: https://ngrok.com/download
2. Start ngrok tunnel:
   ngrok http 3000
3. Get your forwarding URL (e.g., https://abc123.ngrok.io)
4. Update .env:
   FORWARD_WEBHOOK_URL=https://abc123.ngrok.io/webhook
5. Send messages to WhatsApp to test
*/

// ============================================
// TESTING WITH WEBHOOK.SITE (free testing)
// ============================================
/*
1. Go to https://webhook.site
2. Get your unique webhook URL
3. Update .env:
   FORWARD_WEBHOOK_URL=https://webhook.site/your-unique-id
4. Send messages to WhatsApp
5. See received payloads in webhook.site dashboard
*/

module.exports = {
  incomingMessageExample,
  groupMessageExample,
  imageMessageExample,
  messageSentNotificationExample,
  messageSentFailedExample,
};
