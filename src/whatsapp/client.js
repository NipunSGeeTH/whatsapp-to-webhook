const { Client, LocalAuth } = require('whatsapp-web.js');
const QRCode = require('qrcode');
const path = require('path');
const config = require('../config');

let client = null;
let isReady = false;
let currentQR = null;

const initializeWhatsApp = () => {
  return new Promise((resolve, reject) => {
    try {
      client = new Client({
        authStrategy: new LocalAuth({
          clientId: config.whatsapp.sessionName,
          dataPath: path.join(process.cwd(), '.wwebjs_auth'),
        }),
        puppeteer: config.whatsapp.puppeteer,
      });

      client.on('qr', async (qr) => {
        console.log('\n📱 Scan QR:\n');
        try {
          await QRCode.toString(qr, { type: 'terminal', small: true }, (err, qrcode) => {
            if (err) {
              console.error('Error generating QR code:', err);
              console.log('QR Code received (use HTTP endpoint to get the code)');
            } else {
              console.log(qrcode);
            }
          });
        } catch (error) {
          console.error('Error displaying QR code:', error);
        }
        currentQR = qr;
      });

      client.on('authenticated', () => {
        console.log('🔐 WhatsApp authenticated - session being saved...');
      });

      client.on('ready', () => {
        console.log('✅ WhatsApp client is ready!');
        console.log('📁 Session saved to:', path.join(process.cwd(), '.wwebjs_auth'));
        isReady = true;
        currentQR = null;
        resolve(client);
      });

      client.on('auth_failure', (msg) => {
        console.error('Authentication failure:', msg);
        reject(new Error(msg));
      });

      client.on('disconnected', (reason) => {
        console.log('WhatsApp client disconnected:', reason);
        isReady = false;
      });

      client.initialize();
    } catch (error) {
      console.error('Error initializing WhatsApp client:', error);
      reject(error);
    }
  });
};

const getClient = () => {
  if (!client) {
    throw new Error('WhatsApp client not initialized');
  }
  return client;
};

const isClientReady = () => isReady;

const getQRCode = () => {
  return currentQR;
};

const disconnectClient = async () => {
  if (client) {
    await client.destroy();
    client = null;
    isReady = false;
    currentQR = null;
  }
};

module.exports = {
  initializeWhatsApp,
  getClient,
  isClientReady,
  disconnectClient,
  getQRCode,
};
