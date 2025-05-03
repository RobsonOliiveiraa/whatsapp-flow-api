// filepath: /workspaces/whatsapp-flow-api/testKeys.js
const crypto = require('crypto');
const fs = require('fs');

// Carregar as chaves
const publicKey = fs.readFileSync('./public_key.pem', 'utf8');
const privateKey = crypto.createPrivateKey({
  key: fs.readFileSync('./private_key.pem', 'utf8'),
  format: 'pem',
  type: 'pkcs1',
});

// Dados para criptografar
const data = "Teste de criptografia";

// Criptografar os dados
const encryptedData = crypto.publicEncrypt(
  {
    key: publicKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: "sha256",
  },
  Buffer.from(data)
);

console.log('Dados criptografados:', encryptedData.toString('base64'));

// Descriptografar os dados
const decryptedData = crypto.privateDecrypt(
  {
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: "sha256",
  },
  encryptedData
);

console.log('Dados descriptografados:', decryptedData.toString('utf8'));