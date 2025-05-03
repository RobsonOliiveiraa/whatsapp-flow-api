const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Corpo da requisição (deve ser exatamente o mesmo enviado no endpoint)
const body = JSON.stringify({
  example: "dados do fluxo"
});

// Carregar a chave privada do arquivo
const privateKeyPath = path.join(__dirname, 'private_key.pem');
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

// Criar a assinatura
const sign = crypto.createSign('sha256');
sign.update(body);
sign.end();

const signature = sign.sign(privateKey, 'hex');
console.log(`x-hub-signature-256: sha256=${signature}`);