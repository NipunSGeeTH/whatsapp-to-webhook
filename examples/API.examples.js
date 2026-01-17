/**
 * API Usage Examples
 * Test the webhook endpoints and message sending
 */

// ============================================
// 1. GET QR CODE
// ============================================
// Get the QR code as text to generate or scan

// Example request
/*
GET http://localhost:3000/qr
*/

// Example response
/*
{
  "success": true,
  "qrCode": "00020236000101290060hkm5160010A000070070012hk.IWMC0127F9EEAB..."
}
*/

// ============================================
// 2. HEALTH CHECK
// ============================================
// Check if WhatsApp client is ready

// Example request
/*
GET http://localhost:3000/health
*/

// Example response
/*
{
  "status": "ok",
  "whatsappReady": true
}
*/

// ============================================
// 3. SEND TEXT MESSAGE
// ============================================

// Simple text message
/*
POST http://localhost:3000/webhook
Content-Type: application/json

{
  "phoneNumber": "919876543210",
  "message": "Hello! This is a test message."
}
*/

// Text message with options
/*
POST http://localhost:3000/webhook
Content-Type: application/json

{
  "phoneNumber": "919876543210",
  "message": "Check this: https://example.com",
  "messageType": "text",
  "options": {
    "linkPreview": false,
    "sendSeen": true
  }
}
*/

// Text message with mentions
/*
POST http://localhost:3000/webhook
Content-Type: application/json

{
  "phoneNumber": "919876543210",
  "message": "Hey @user1 and @user2, check this out!",
  "options": {
    "mentions": ["+919876543211@c.us", "+919876543212@c.us"]
  }
}
*/

// ============================================
// 4. SEND MEDIA MESSAGE
// ============================================

// Send image as HD
/*
POST http://localhost:3000/webhook
Content-Type: application/json

{
  "phoneNumber": "919876543210",
  "message": "Here is a high quality image!",
  "mediaUrl": "/path/to/image.jpg",
  "messageType": "media",
  "options": {
    "sendMediaAsHd": true
  }
}
*/

// Send image as view once
/*
POST http://localhost:3000/webhook
Content-Type: application/json

{
  "phoneNumber": "919876543210",
  "message": "This image will disappear after viewing!",
  "mediaUrl": "/path/to/image.jpg",
  "messageType": "media",
  "options": {
    "isViewOnce": true
  }
}
*/

// Send as sticker
/*
POST http://localhost:3000/webhook
Content-Type: application/json

{
  "phoneNumber": "919876543210",
  "mediaUrl": "/path/to/sticker.png",
  "messageType": "media",
  "options": {
    "sendMediaAsSticker": true,
    "stickerAuthor": "My Bot",
    "stickerName": "MyStickers",
    "stickerCategories": ["😀", "😂"]
  }
}
*/

// Send audio as voice message
/*
POST http://localhost:3000/webhook
Content-Type: application/json

{
  "phoneNumber": "919876543210",
  "mediaUrl": "/path/to/audio.mp3",
  "messageType": "media",
  "options": {
    "sendAudioAsVoice": true
  }
}
*/

// Send video as GIF
/*
POST http://localhost:3000/webhook
Content-Type: application/json

{
  "phoneNumber": "919876543210",
  "mediaUrl": "/path/to/video.mp4",
  "messageType": "media",
  "options": {
    "sendVideoAsGif": true
  }
}
*/

// ============================================
// 5. SEND GROUP MESSAGE
// ============================================

/*
POST http://localhost:3000/webhook
Content-Type: application/json

{
  "groupId": "123456789-1234567890@g.us",
  "message": "Hello everyone! This is a group message.",
  "messageType": "group"
}
*/

// Group message with mentions
/*
POST http://localhost:3000/webhook
Content-Type: application/json

{
  "groupId": "123456789-1234567890@g.us",
  "message": "Hey @user1 and @user2!",
  "messageType": "group",
  "options": {
    "mentions": ["+919876543211@c.us", "+919876543212@c.us"]
  }
}
*/

// ============================================
// 6. SEND BULK MESSAGES
// ============================================

/*
POST http://localhost:3000/webhook
Content-Type: application/json

{
  "phoneNumbers": ["919876543210", "919876543211", "919876543212"],
  "message": "Bulk message to multiple contacts!",
  "messageType": "bulk"
}
*/

// ============================================
// CURL EXAMPLES
// ============================================

// Get QR Code
/*
curl -X GET http://localhost:3000/qr
*/

// Send text message
/*
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "919876543210",
    "message": "Hello World!"
  }'
*/

// Send image as HD
/*
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "919876543210",
    "message": "High quality image!",
    "mediaUrl": "/path/to/image.jpg",
    "messageType": "media",
    "options": {
      "sendMediaAsHd": true
    }
  }'
*/

// Send group message
/*
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "groupId": "123456789-1234567890@g.us",
    "message": "Hello group!",
    "messageType": "group"
  }'
*/

// ============================================
// RESPONSE EXAMPLES
// ============================================

// Successful text message response
/*
{
  "success": true,
  "event": "message:sent",
  "timestamp": "2026-01-17T12:30:45.123Z",
  "clientReady": true,
  "message": {
    "success": true,
    "type": "text",
    "to": "919876543210",
    "chatId": "919876543210@c.us",
    "isGroup": false,
    "messageId": "wamid.xxx",
    "body": "Hello World!",
    "timestamp": 1234567890,
    "ack": 2,
    "fromMe": true,
    "hasMedia": false,
    "deviceType": "web",
    "sendOptions": {
      "linkPreview": true,
      "sendSeen": true,
      "parseVCards": true,
      "mentions": false,
      "quotedMessage": false
    },
    "sentAt": "2026-01-17T12:30:45.123Z",
    "clientReady": true
  }
}
*/

// Successful media message response
/*
{
  "success": true,
  "event": "message:sent",
  "timestamp": "2026-01-17T12:30:45.123Z",
  "clientReady": true,
  "message": {
    "success": true,
    "type": "media",
    "to": "919876543210",
    "chatId": "919876543210@c.us",
    "isGroup": false,
    "messageId": "wamid.xxx",
    "body": "Check this!",
    "mediaType": "image/jpeg",
    "hasMedia": true,
    "timestamp": 1234567890,
    "ack": 2,
    "fromMe": true,
    "deviceType": "web",
    "sendOptions": {
      "caption": true,
      "sendMediaAsHd": true,
      "sendMediaAsSticker": false,
      "sendMediaAsDocument": false,
      "sendVideoAsGif": false,
      "sendAudioAsVoice": false,
      "isViewOnce": false,
      "mentions": false,
      "quotedMessage": false
    },
    "sentAt": "2026-01-17T12:30:45.123Z",
    "clientReady": true
  }
}
*/

// Incoming message webhook (forwarded from WhatsApp)
/*
{
  "messageId": "wamid.xxx",
  "from": "+919876543210@c.us",
  "fromNumber": "+919876543210",
  "to": "+0987654321@c.us",
  "author": null,
  "body": "Hello! How are you?",
  "type": "chat",
  "timestamp": 1234567890,
  "ack": 1,
  "chat": {
    "id": "+919876543210@c.us",
    "isGroup": false,
    "isBroadcast": false,
    "isPrivate": true
  },
  "fromMe": false,
  "hasMedia": false,
  "media": null,
  "hasQuotedMsg": false,
  "hasReaction": false,
  "hasGroupMentions": false,
  "participant": null,
  "groupMentions": [],
  "mentionedIds": [],
  "isForwarded": false,
  "isGif": false,
  "isStarred": false,
  "isStatus": false,
  "isEphemeral": false,
  "mediaKey": null,
  "duration": null,
  "forwardingScore": 0,
  "links": [],
  "vCards": [],
  "location": null,
  "inviteV4": null,
  "orderId": null,
  "token": null,
  "deviceType": "web"
}
*/

// Incoming media message webhook
/*
{
  "messageId": "wamid.xxx",
  "from": "+919876543210@c.us",
  "fromNumber": "+919876543210",
  "body": "Check this image!",
  "type": "image",
  "timestamp": 1234567890,
  "chat": {
    "id": "+919876543210@c.us",
    "isGroup": false,
    "isBroadcast": false,
    "isPrivate": true
  },
  "hasMedia": true,
  "media": {
    "mimetype": "image/jpeg",
    "data": "iVBORw0KGgoAAAANSUhEUgAAAAUA...",
    "filename": "photo.jpg",
    "size": 2621440
  },
  "isViewOnce": false,
  "deviceType": "web"
}
*/

module.exports = {
  documentation: 'See inline comments for API usage examples'
};
