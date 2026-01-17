/**
 * Message Service Tests
 * Test all message sending functionality
 */

const {
  sendTextMessage,
  sendMediaMessage,
  sendGroupMessage,
  sendBulkMessages,
} = require('../src/whatsapp/messageService');

// Mock phone numbers for testing
const TEST_PHONE = '919876543210';
const TEST_GROUP_ID = '123456789-1234567890@g.us';
const TEST_NUMBERS = ['919876543210', '919876543211', '919876543212'];

/**
 * Test: Send simple text message
 */
async function testSendTextMessage() {
  console.log('\n--- Test: Send Text Message ---');
  try {
    const result = await sendTextMessage(TEST_PHONE, 'Hello World! This is a test message.');
    console.log('✓ Success:', result.success);
    console.log('  Message ID:', result.messageId);
    console.log('  Status:', result.ack);
    return result;
  } catch (error) {
    console.error('✗ Failed:', error.message);
  }
}

/**
 * Test: Send text message with mentions
 */
async function testSendTextWithMentions() {
  console.log('\n--- Test: Send Text with Mentions ---');
  try {
    const result = await sendTextMessage(
      TEST_PHONE,
      'Hello @user1 and @user2!',
      {
        mentions: ['919876543211@c.us', '919876543212@c.us'],
      }
    );
    console.log('✓ Success:', result.success);
    console.log('  Mentions:', result.sendOptions.mentions);
    return result;
  } catch (error) {
    console.error('✗ Failed:', error.message);
  }
}

/**
 * Test: Send text message without link preview
 */
async function testSendTextNoLinkPreview() {
  console.log('\n--- Test: Send Text without Link Preview ---');
  try {
    const result = await sendTextMessage(
      TEST_PHONE,
      'Check this link: https://example.com',
      {
        linkPreview: false,
      }
    );
    console.log('✓ Success:', result.success);
    console.log('  Link Preview:', result.sendOptions.linkPreview);
    return result;
  } catch (error) {
    console.error('✗ Failed:', error.message);
  }
}

/**
 * Test: Send media message as HD
 */
async function testSendMediaAsHD() {
  console.log('\n--- Test: Send Media as HD ---');
  try {
    // Note: Requires an actual image file
    const result = await sendMediaMessage(
      TEST_PHONE,
      './test-image.jpg',
      'Here is a high quality image!',
      {
        sendMediaAsHd: true,
      }
    );
    console.log('✓ Success:', result.success);
    console.log('  Media Type:', result.mediaType);
    console.log('  HD Mode:', result.sendOptions.sendMediaAsHd);
    return result;
  } catch (error) {
    console.error('✗ Failed (Expected if image not present):', error.message);
  }
}

/**
 * Test: Send media as sticker
 */
async function testSendMediaAsSticker() {
  console.log('\n--- Test: Send Media as Sticker ---');
  try {
    const result = await sendMediaMessage(
      TEST_PHONE,
      './test-sticker.png',
      '',
      {
        sendMediaAsSticker: true,
        stickerAuthor: 'My WhatsApp Bot',
        stickerName: 'TestStickers',
        stickerCategories: ['😀', '😂', '❤️'],
      }
    );
    console.log('✓ Success:', result.success);
    console.log('  Sent as Sticker:', result.sendOptions.sendMediaAsSticker);
    return result;
  } catch (error) {
    console.error('✗ Failed (Expected if image not present):', error.message);
  }
}

/**
 * Test: Send audio as voice message
 */
async function testSendAudioAsVoice() {
  console.log('\n--- Test: Send Audio as Voice Message ---');
  try {
    const result = await sendMediaMessage(
      TEST_PHONE,
      './test-audio.mp3',
      '',
      {
        sendAudioAsVoice: true,
      }
    );
    console.log('✓ Success:', result.success);
    console.log('  Voice Message:', result.sendOptions.sendAudioAsVoice);
    return result;
  } catch (error) {
    console.error('✗ Failed (Expected if audio not present):', error.message);
  }
}

/**
 * Test: Send view once media
 */
async function testSendViewOnceMedia() {
  console.log('\n--- Test: Send View Once Media ---');
  try {
    const result = await sendMediaMessage(
      TEST_PHONE,
      './test-image.jpg',
      'This image will disappear after viewing!',
      {
        isViewOnce: true,
      }
    );
    console.log('✓ Success:', result.success);
    console.log('  View Once:', result.sendOptions.isViewOnce);
    return result;
  } catch (error) {
    console.error('✗ Failed (Expected if image not present):', error.message);
  }
}

/**
 * Test: Send group message
 */
async function testSendGroupMessage() {
  console.log('\n--- Test: Send Group Message ---');
  try {
    const result = await sendGroupMessage(
      TEST_GROUP_ID,
      'Hello everyone! This is a group message.'
    );
    console.log('✓ Success:', result.success);
    console.log('  Group ID:', result.groupId);
    console.log('  Is Group:', result.isGroup);
    return result;
  } catch (error) {
    console.error('✗ Failed:', error.message);
  }
}

/**
 * Test: Send group message with mentions
 */
async function testSendGroupMessageWithMentions() {
  console.log('\n--- Test: Send Group Message with Mentions ---');
  try {
    const result = await sendGroupMessage(
      TEST_GROUP_ID,
      'Hey @user1 and @user2, check this out!',
      {
        mentions: ['919876543211@c.us', '919876543212@c.us'],
      }
    );
    console.log('✓ Success:', result.success);
    console.log('  Mentions:', result.sendOptions.mentions);
    return result;
  } catch (error) {
    console.error('✗ Failed:', error.message);
  }
}

/**
 * Test: Send bulk messages
 */
async function testSendBulkMessages() {
  console.log('\n--- Test: Send Bulk Messages ---');
  try {
    const results = await sendBulkMessages(
      TEST_NUMBERS,
      'This is a bulk message sent to multiple contacts!'
    );
    console.log('✓ Success');
    console.log('  Total Messages:', results.length);
    console.log('  Successful:', results.filter(r => r.success).length);
    console.log('  Failed:', results.filter(r => !r.success).length);
    return results;
  } catch (error) {
    console.error('✗ Failed:', error.message);
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   Message Service Test Suite           ║');
  console.log('╚════════════════════════════════════════╝');

  // Text message tests
  await testSendTextMessage();
  await testSendTextWithMentions();
  await testSendTextNoLinkPreview();

  // Media message tests
  await testSendMediaAsHD();
  await testSendMediaAsSticker();
  await testSendAudioAsVoice();
  await testSendViewOnceMedia();

  // Group message tests
  await testSendGroupMessage();
  await testSendGroupMessageWithMentions();

  // Bulk message tests
  await testSendBulkMessages();

  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   Test Suite Complete                  ║');
  console.log('╚════════════════════════════════════════╝\n');
}

// Export functions for external use
module.exports = {
  testSendTextMessage,
  testSendTextWithMentions,
  testSendTextNoLinkPreview,
  testSendMediaAsHD,
  testSendMediaAsSticker,
  testSendAudioAsVoice,
  testSendViewOnceMedia,
  testSendGroupMessage,
  testSendGroupMessageWithMentions,
  testSendBulkMessages,
  runAllTests,
};

// Run tests if executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}
