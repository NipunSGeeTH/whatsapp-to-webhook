const { Client, LocalAuth } = require('whatsapp-web.js');
const config = require('../config');

let client = null;
let isReady = false;
let currentQR = null;

const initializeWhatsApp = () => {
  return new Promise((resolve, reject) => {
    try {
      client = new Client({
        auth: new LocalAuth({
          clientId: config.whatsapp.sessionName,
        }),
        puppeteer: config.whatsapp.puppeteer,
      });

      client.on('qr', async (qr) => {
        console.log('QR Code received');
        currentQR = qr;
      });

      client.on('ready', () => {
        console.log('WhatsApp client is ready!');
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
