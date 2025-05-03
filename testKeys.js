// filepath: /workspaces/whatsapp-flow-api/testKeys.js
const crypto = require('crypto');
const fs = require('fs');

// Carregar as chaves
const publicKey = fs.readFileSync('./public_key.pem', 'utf8');
const privateKey = crypto.createPrivateKey({
  key: fs.readFileSync('./private_key.pem', 'utf8'),
  format: 'pem',
  type: 'pkcs1', // Ignorado se o formato for 'pem'
  passphrase: '', // Adicione a senha aqui, se necessário
});

// Dados para criptografar
const data = "Teste de criptografia";

try {
  // Criptografar os dados com a chave pública
  const encryptedData = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(data)
  );

  console.log('Dados criptografados:', encryptedData.toString('base64'));

  // Descriptografar os dados com a chave privada
  const decryptedData = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    encryptedData
  );

  console.log('Dados descriptografados:', decryptedData.toString('utf8'));

  // Verificar se os dados correspondem
  if (decryptedData.toString() === data) {
    console.log("Sucesso, as chaves correspondem!");
  } else {
    console.log("Falha, as chaves não correspondem!");
  }
} catch (error) {
  console.error('Erro durante o teste de criptografia/descriptografia:', error);
}