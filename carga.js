const crypto = require('crypto');
const fs = require('fs');

// Carregar a chave pública
const publicKey = fs.readFileSync('./public_key.pem', 'utf8');

// Dados para criptografar
const data = JSON.stringify({ example: "dados do fluxo" });

// Criptografar os dados
const encryptedData = crypto.publicEncrypt(
  {
    key: publicKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: "sha256",
  },
  Buffer.from(data)
);

console.log('Payload criptografado (Base64):', encryptedData.toString('base64'));