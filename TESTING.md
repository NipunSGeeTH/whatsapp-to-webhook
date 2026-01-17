# WhatsApp Bot - Test Documentation

## Quick Start Testing

### 1. Start the Server
```bash
pnpm start
```

You should see:
```
========================================
✓ Server started successfully
========================================
📌 Port: 3000
🌐 Server URL: http://localhost:3000
📱 QR Code URL: http://localhost:3000/qr
🔗 Webhook Path: http://localhost:3000/webhook
💚 Health Check: http://localhost:3000/health
========================================
```

### 2. Scan QR Code
Get the QR code and scan with WhatsApp:
```bash
curl http://localhost:3000/qr | jq .
```

### 3. Test Health Check
```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "ok",
  "whatsappReady": true
}
```

---

## Testing Message Sending

### Send Simple Text Message
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "919876543210",
    "message": "Hello World!"
  }'
```

### Send Text Without Link Preview
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "919876543210",
    "message": "Check this: https://example.com",
    "options": {"linkPreview": false}
  }'
```

### Send Image as HD
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "919876543210",
    "message": "High quality image!",
    "mediaUrl": "/path/to/image.jpg",
    "messageType": "media",
    "options": {"sendMediaAsHd": true}
  }'
```

### Send as Sticker
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "919876543210",
    "mediaUrl": "/path/to/image.png",
    "messageType": "media",
    "options": {
      "sendMediaAsSticker": true,
      "stickerAuthor": "My Bot",
      "stickerName": "MyStickers"
    }
  }'
```

### Send Audio as Voice Message
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "919876543210",
    "mediaUrl": "/path/to/audio.mp3",
    "messageType": "media",
    "options": {"sendAudioAsVoice": true}
  }'
```

### Send Group Message
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "groupId": "123456789-1234567890@g.us",
    "message": "Hello everyone!",
    "messageType": "group"
  }'
```

---

## Running Unit Tests

### Run All Tests
```bash
node tests/messageService.test.js
```

### Run Specific Test
```bash
node -e "require('./tests/messageService.test.js').testSendTextMessage()"
```

---

## Running API Tests

### Run cURL Tests
```bash
bash tests/API.test.sh
```

### Import into Postman
1. Run: `bash tests/API.test.sh`
2. A `whatsapp-api.postman_collection.json` file will be created
3. Import into Postman: File → Import → Select the JSON file
4. Set `base_url` variable to `http://localhost:3000`

---

## Webhook Integration Testing

### Option 1: Using Webhook.site (Easy - No Setup)
1. Visit https://webhook.site
2. Copy your unique webhook URL
3. Set in `.env`:
   ```
   FORWARD_WEBHOOK_URL=https://webhook.site/your-unique-id
   ```
4. Restart the server
5. Send WhatsApp messages - see them in webhook.site

### Option 2: Using ngrok (Local Development)
1. Install ngrok: https://ngrok.com
2. Start ngrok:
   ```bash
   ngrok http 3000
   ```
3. Copy forwarding URL (e.g., `https://abc123.ngrok.io`)
4. Set in `.env`:
   ```
   FORWARD_WEBHOOK_URL=https://abc123.ngrok.io/webhook
   ```
5. Restart the server
6. Send WhatsApp messages - they'll be forwarded

### Option 3: Using a Real Server
1. Deploy this app to a server
2. Set in `.env`:
   ```
   FORWARD_WEBHOOK_URL=https://your-domain.com/webhook
   ```
3. Ensure `/webhook` endpoint exists on your server
4. Restart the app

---

## Message Features Testing

### Test Mentions
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "919876543210",
    "message": "Hey @user1 and @user2!",
    "options": {
      "mentions": ["+919876543211@c.us", "+919876543212@c.us"]
    }
  }'
```

### Test View Once Media
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "919876543210",
    "message": "This will disappear!",
    "mediaUrl": "/path/to/image.jpg",
    "messageType": "media",
    "options": {"isViewOnce": true}
  }'
```

### Test Video as GIF
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "919876543210",
    "mediaUrl": "/path/to/video.mp4",
    "messageType": "media",
    "options": {"sendVideoAsGif": true}
  }'
```

### Test Bulk Messages
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumbers": ["919876543210", "919876543211", "919876543212"],
    "message": "Bulk message to multiple contacts!",
    "messageType": "bulk"
  }'
```

---

## Expected Responses

### Successful Text Message
```json
{
  "success": true,
  "type": "text",
  "to": "919876543210",
  "messageId": "wamid.xxx",
  "body": "Hello World!",
  "ack": 2,
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
```

### Incoming Message (via Webhook)
```json
{
  "messageId": "wamid.xxx",
  "from": "+919876543210@c.us",
  "fromNumber": "+919876543210",
  "body": "Hello!",
  "type": "chat",
  "chat": {
    "id": "+919876543210@c.us",
    "isGroup": false,
    "isPrivate": true
  },
  "hasMedia": false,
  "media": null,
  "deviceType": "web"
}
```

### Incoming Image (via Webhook - < 10MB)
```json
{
  "messageId": "wamid.xxx",
  "from": "+919876543210@c.us",
  "body": "Check this!",
  "type": "image",
  "hasMedia": true,
  "media": {
    "mimetype": "image/jpeg",
    "data": "iVBORw0KGgoAAAANSUhEUgAAAAUA...",
    "filename": "photo.jpg",
    "size": 2621440
  }
}
```

---

## Troubleshooting

### QR Code Not Generating
- Ensure WhatsApp Web login is working
- Check if browser is accessible (puppeteer)
- Try clearing `.wwebjs_auth` folder

### Messages Not Sending
- Ensure `clientReady: true` in health check
- Check phone number format (must include country code)
- Verify contact exists on WhatsApp

### Webhook Not Receiving Messages
- Check `FORWARD_WEBHOOK_URL` is set in `.env`
- Ensure webhook endpoint is accessible
- Check firewall/NAT settings
- Use webhook.site to test endpoint

### Media Not Downloading
- Media size must be < 10MB
- Check internet connection
- Verify media is not already deleted

---

## Tips & Best Practices

1. **Rate Limiting**: Add delays between bulk messages
2. **Error Handling**: Always handle failed responses
3. **Logging**: Enable debug logging in development
4. **Security**: Keep `VERIFY_TOKEN` secret
5. **Testing**: Use webhook.site for quick testing
6. **Monitoring**: Set up logging/monitoring for production

---

## Example Node.js Client

```javascript
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Send text message
async function sendMessage(phoneNumber, message) {
  try {
    const response = await axios.post(`${BASE_URL}/webhook`, {
      phoneNumber,
      message
    });
    console.log('✓ Message sent:', response.data.messageId);
    return response.data;
  } catch (error) {
    console.error('✗ Failed:', error.response?.data || error.message);
  }
}

// Get QR code
async function getQRCode() {
  try {
    const response = await axios.get(`${BASE_URL}/qr`);
    console.log('QR Code:', response.data.qrCode);
    return response.data;
  } catch (error) {
    console.error('✗ Failed:', error.message);
  }
}

// Check health
async function checkHealth() {
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('Status:', response.data.status);
    console.log('WhatsApp Ready:', response.data.whatsappReady);
    return response.data;
  } catch (error) {
    console.error('✗ Failed:', error.message);
  }
}

// Usage
sendMessage('919876543210', 'Hello from WhatsApp Bot!');
getQRCode();
checkHealth();
```

---

For more examples, see:
- `tests/messageService.test.js` - Unit tests
- `examples/API.examples.js` - API examples
- `examples/webhookIntegration.example.js` - Webhook integration
- `tests/API.test.sh` - cURL test commands
