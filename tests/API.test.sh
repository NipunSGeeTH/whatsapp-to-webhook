#!/bin/bash
# Postman Collection - WhatsApp Bot API Tests

# This file can be imported into Postman as a collection
# Or use curl commands below to test the API

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║           WhatsApp Bot API - Test Commands                    ║"
echo "╚════════════════════════════════════════════════════════════════╝"

BASE_URL="http://localhost:3000"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================
# 1. GET QR CODE
# ============================================
echo -e "\n${BLUE}1. Get QR Code${NC}"
echo "curl -X GET $BASE_URL/qr"
echo ""
echo "To test: curl -X GET $BASE_URL/qr | jq ."

# ============================================
# 2. HEALTH CHECK
# ============================================
echo -e "\n${BLUE}2. Health Check${NC}"
echo "curl -X GET $BASE_URL/health"
echo ""
echo "To test: curl -X GET $BASE_URL/health | jq ."

# ============================================
# 3. SEND TEXT MESSAGE
# ============================================
echo -e "\n${BLUE}3. Send Text Message${NC}"
echo "curl -X POST $BASE_URL/webhook \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"phoneNumber\": \"919876543210\","
echo "    \"message\": \"Hello World!\""
echo "  }'"
echo ""
echo "To test:"
echo "curl -X POST $BASE_URL/webhook -H \"Content-Type: application/json\" -d '{\"phoneNumber\": \"919876543210\", \"message\": \"Hello World!\"}' | jq ."

# ============================================
# 4. SEND TEXT WITH NO LINK PREVIEW
# ============================================
echo -e "\n${BLUE}4. Send Text without Link Preview${NC}"
echo "curl -X POST $BASE_URL/webhook \\"
echo "  -H \"Content-Type: application/json\" \""
echo "  -d '{"
echo "    \"phoneNumber\": \"919876543210\","
echo "    \"message\": \"Check: https://example.com\","
echo "    \"options\": {\"linkPreview\": false}"
echo "  }'"

# ============================================
# 5. SEND TEXT WITH MENTIONS
# ============================================
echo -e "\n${BLUE}5. Send Text with Mentions${NC}"
echo "curl -X POST $BASE_URL/webhook \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"phoneNumber\": \"919876543210\","
echo "    \"message\": \"Hey @user1 and @user2!\","
echo "    \"options\": {"
echo "      \"mentions\": [\"+919876543211@c.us\", \"+919876543212@c.us\"]"
echo "    }"
echo "  }'"

# ============================================
# 6. SEND MEDIA AS HD
# ============================================
echo -e "\n${BLUE}6. Send Image as HD${NC}"
echo "curl -X POST $BASE_URL/webhook \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"phoneNumber\": \"919876543210\","
echo "    \"message\": \"High quality image!\","
echo "    \"mediaUrl\": \"/path/to/image.jpg\","
echo "    \"messageType\": \"media\","
echo "    \"options\": {\"sendMediaAsHd\": true}"
echo "  }'"

# ============================================
# 7. SEND IMAGE AS VIEW ONCE
# ============================================
echo -e "\n${BLUE}7. Send Image as View Once${NC}"
echo "curl -X POST $BASE_URL/webhook \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"phoneNumber\": \"919876543210\","
echo "    \"message\": \"This will disappear!\","
echo "    \"mediaUrl\": \"/path/to/image.jpg\","
echo "    \"messageType\": \"media\","
echo "    \"options\": {\"isViewOnce\": true}"
echo "  }'"

# ============================================
# 8. SEND STICKER
# ============================================
echo -e "\n${BLUE}8. Send as Sticker${NC}"
echo "curl -X POST $BASE_URL/webhook \\"
echo "  -H \"Content-Type: application/json\" \""
echo "  -d '{"
echo "    \"phoneNumber\": \"919876543210\","
echo "    \"mediaUrl\": \"/path/to/sticker.png\","
echo "    \"messageType\": \"media\","
echo "    \"options\": {"
echo "      \"sendMediaAsSticker\": true,"
echo "      \"stickerAuthor\": \"My Bot\","
echo "      \"stickerName\": \"MyStickers\""
echo "    }"
echo "  }'"

# ============================================
# 9. SEND AUDIO AS VOICE
# ============================================
echo -e "\n${BLUE}9. Send Audio as Voice Message${NC}"
echo "curl -X POST $BASE_URL/webhook \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"phoneNumber\": \"919876543210\","
echo "    \"mediaUrl\": \"/path/to/audio.mp3\","
echo "    \"messageType\": \"media\","
echo "    \"options\": {\"sendAudioAsVoice\": true}"
echo "  }'"

# ============================================
# 10. SEND GROUP MESSAGE
# ============================================
echo -e "\n${BLUE}10. Send Group Message${NC}"
echo "curl -X POST $BASE_URL/webhook \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"groupId\": \"123456789-1234567890@g.us\","
echo "    \"message\": \"Hello everyone!\","
echo "    \"messageType\": \"group\""
echo "  }'"

# ============================================
# 11. SEND GROUP MESSAGE WITH MENTIONS
# ============================================
echo -e "\n${BLUE}11. Send Group Message with Mentions${NC}"
echo "curl -X POST $BASE_URL/webhook \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"groupId\": \"123456789-1234567890@g.us\","
echo "    \"message\": \"Hey @user1!\","
echo "    \"messageType\": \"group\","
echo "    \"options\": {"
echo "      \"mentions\": [\"+919876543211@c.us\"]"
echo "    }"
echo "  }'"

# ============================================
# 12. SEND BULK MESSAGES
# ============================================
echo -e "\n${BLUE}12. Send Bulk Messages${NC}"
echo "curl -X POST $BASE_URL/webhook \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"phoneNumbers\": [\"919876543210\", \"919876543211\"],"
echo "    \"message\": \"Bulk message!\","
echo "    \"messageType\": \"bulk\""
echo "  }'"

echo -e "\n${GREEN}════════════════════════════════════════════════════════════════${NC}\n"

# ============================================
# POSTMAN COLLECTION JSON
# ============================================
# Save this as a .json file and import into Postman

cat > whatsapp-api.postman_collection.json << 'EOF'
{
  "info": {
    "_postman_id": "whatsapp-bot-api",
    "name": "WhatsApp Bot API",
    "description": "WhatsApp Bot API Test Collection",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get QR Code",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/qr"
      }
    },
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/health"
      }
    },
    {
      "name": "Send Text Message",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"phoneNumber\": \"919876543210\",\n  \"message\": \"Hello World!\"\n}"
        },
        "url": "{{base_url}}/webhook"
      }
    },
    {
      "name": "Send Text with Mentions",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"phoneNumber\": \"919876543210\",\n  \"message\": \"Hey @user1!\",\n  \"options\": {\n    \"mentions\": [\"+919876543211@c.us\"]\n  }\n}"
        },
        "url": "{{base_url}}/webhook"
      }
    },
    {
      "name": "Send Image as HD",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"phoneNumber\": \"919876543210\",\n  \"message\": \"High quality image!\",\n  \"mediaUrl\": \"/path/to/image.jpg\",\n  \"messageType\": \"media\",\n  \"options\": {\n    \"sendMediaAsHd\": true\n  }\n}"
        },
        "url": "{{base_url}}/webhook"
      }
    },
    {
      "name": "Send as Sticker",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"phoneNumber\": \"919876543210\",\n  \"mediaUrl\": \"/path/to/sticker.png\",\n  \"messageType\": \"media\",\n  \"options\": {\n    \"sendMediaAsSticker\": true,\n    \"stickerAuthor\": \"My Bot\"\n  }\n}"
        },
        "url": "{{base_url}}/webhook"
      }
    },
    {
      "name": "Send Audio as Voice",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"phoneNumber\": \"919876543210\",\n  \"mediaUrl\": \"/path/to/audio.mp3\",\n  \"messageType\": \"media\",\n  \"options\": {\n    \"sendAudioAsVoice\": true\n  }\n}"
        },
        "url": "{{base_url}}/webhook"
      }
    },
    {
      "name": "Send Group Message",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"groupId\": \"123456789-1234567890@g.us\",\n  \"message\": \"Hello everyone!\",\n  \"messageType\": \"group\"\n}"
        },
        "url": "{{base_url}}/webhook"
      }
    },
    {
      "name": "Send Bulk Messages",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"phoneNumbers\": [\"919876543210\", \"919876543211\"],\n  \"message\": \"Bulk message!\",\n  \"messageType\": \"bulk\"\n}"
        },
        "url": "{{base_url}}/webhook"
      }
    }
  ]
}
EOF

echo "✓ Postman collection saved as: whatsapp-api.postman_collection.json"
echo "✓ Import this into Postman to test all endpoints"
echo ""
