# WhatsApp Web.js Bot

A webhook-based WhatsApp bot using whatsapp-web.js library.

## Project Structure

```
src/
├── config.js                 # Configuration file
├── app.js                    # Main Express app
├── whatsapp/
│   ├── client.js            # WhatsApp client initialization
│   ├── messageService.js    # Message sending functions
│   └── events.js            # Event listeners setup
└── routes/
    └── webhook.js           # Webhook endpoints
```

## Features

- **Send Text Messages**: Send messages to individual numbers
- **Send Media**: Send images, videos, audio, documents
- **Group Messaging**: Send messages to groups
- **Bulk Messaging**: Send messages to multiple numbers
- **Webhook Listener**: Receive incoming messages
- **Event Handling**: Custom event listeners for various WhatsApp events

## Installation

```bash
pnpm install express
```

## Environment Variables

Create a `.env` file:

```
WEBHOOK_PORT=3000
WEBHOOK_PATH=/webhook
VERIFY_TOKEN=your-secure-token
LOG_LEVEL=info
```

## Usage

### Start the server

```bash
node index.js
```

### Send a message via webhook

```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "919876543210",
    "message": "Hello from WhatsApp bot!",
    "messageType": "text"
  }'
```

### Send media

```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "919876543210",
    "message": "Check this image!",
    "mediaUrl": "/path/to/image.jpg",
    "messageType": "media"
  }'
```

## API Endpoints

- `GET /health` - Health check
- `GET /webhook?verify_token=your-token&challenge=value` - Webhook verification
- `POST /webhook` - Send message or receive webhook events

## Phone Number Format

Use the phone number with country code without spaces or special characters:
- India: `919876543210` (for +91-9876543210)
- US: `12025551234` (for +1-202-555-1234)

## Notes

- The session is stored locally using LocalAuth
- First run will require QR code scanning for authentication
- WhatsApp Web.js uses Puppeteer to control a headless Chrome instance
