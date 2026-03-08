const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const STORE_PATH = path.join(process.env.HOME, '.openclaw/skills/web3/wallets.enc');

function encrypt(data, password) {
  const salt = crypto.randomBytes(16);
  const key = crypto.scryptSync(password, salt, 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(data), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return JSON.stringify({
    salt: salt.toString('hex'),
    iv: iv.toString('hex'),
    tag: tag.toString('hex'),
    data: encrypted.toString('hex')
  });
}

function decrypt(encryptedStr, password) {
  const { salt, iv, tag, data } = JSON.parse(encryptedStr);
  const key = crypto.scryptSync(password, Buffer.from(salt, 'hex'), 32);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(tag, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(data, 'hex')), decipher.final()]);
  return JSON.parse(decrypted.toString('utf8'));
}

function saveWallet(name, chain, privateKey, mnemonic, password) {
  let wallets = {};
  if (fs.existsSync(STORE_PATH)) {
    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    wallets = decrypt(raw, password);
  }
  wallets[name] = { chain, privateKey, mnemonic, createdAt: new Date().toISOString() };
  fs.writeFileSync(STORE_PATH, encrypt(wallets, password));
  fs.chmodSync(STORE_PATH, 0o600);
  console.log(`Wallet '${name}' saved.`);
}

function loadWallet(name, password) {
  if (!fs.existsSync(STORE_PATH)) throw new Error('No wallet store found');
  const raw = fs.readFileSync(STORE_PATH, 'utf8');
  const wallets = decrypt(raw, password);
  if (!wallets[name]) throw new Error(`Wallet '${name}' not found`);
  return wallets[name];
}

function listWallets(password) {
  if (!fs.existsSync(STORE_PATH)) return [];
  const raw = fs.readFileSync(STORE_PATH, 'utf8');
  const wallets = decrypt(raw, password);
  return Object.keys(wallets).map(name => ({
    name,
    chain: wallets[name].chain,
    createdAt: wallets[name].createdAt
  }));
}

module.exports = { saveWallet, loadWallet, listWallets };
