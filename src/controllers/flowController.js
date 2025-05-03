const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const verifySignature = require('../utils/verifySignature');

let publicKey = ''; // Variável para armazenar a chave pública em memória

// Carregar a chave privada usando crypto.createPrivateKey
const privateKeyPath = path.join(__dirname, '../../private_key.pem');
const privateKey = crypto.createPrivateKey({
  key: fs.readFileSync(privateKeyPath, 'utf8'),
  format: 'pem',
  type: 'pkcs1', // Ignorado se o formato for 'pem'
  passphrase: '', // Adicione a senha aqui, se necessário
});
console.log('Chave privada carregada com sucesso.');

const uploadPublicKey = (req, res) => {
  const { key } = req.body;

  if (!key) {
    console.error('Erro: Chave pública não fornecida.');
    return res.status(400).send('Chave pública não fornecida');
  }

  publicKey = key;

  // Salvar a chave pública no arquivo
  const filePath = path.join(__dirname, '../../public_key.pem');
  fs.writeFileSync(filePath, key);

  console.log('Chave pública carregada e salva com sucesso:', key);
  res.status(200).send('Chave pública carregada com sucesso');
};

const handleFlow = (req, res) => {
  const encryptedPayload = req.body.encrypted_payload;

  if (!encryptedPayload) {
    console.error('Erro: Carga útil criptografada não fornecida.');
    return res.status(400).send('Carga útil criptografada não fornecida');
  }

  try {
    console.log('Carga útil criptografada recebida (Base64):', encryptedPayload);
    console.log('Tamanho da carga útil recebida:', encryptedPayload.length);

    // Descriptografar a carga útil usando RSA_PKCS1_OAEP_PADDING
    console.log('Iniciando descriptografia da carga útil...');
    const decryptedPayload = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256", // Algoritmo de hash usado para OAEP
      },
      Buffer.from(encryptedPayload, 'base64')
    );

    const payload = JSON.parse(decryptedPayload.toString('utf8'));
    console.log('Payload descriptografado com sucesso:', payload);

    // Processar o payload
    res.status(200).send('Fluxo processado com sucesso');
  } catch (error) {
    console.error('Erro ao descriptografar a carga útil:', error);
    console.error('Detalhes do erro:', {
      library: error.library,
      reason: error.reason,
      code: error.code,
    });
    res.status(500).send('Erro ao processar a carga útil');
  }
};

// Token de verificação definido por você
const VERIFY_TOKEN = "l&Ch1532X_(T";

const validateWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('Requisição de validação recebida:', { mode, token, challenge });

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verificado com sucesso!');
      return res.status(200).send(challenge); // Retorna o desafio para o Facebook
    } else {
      console.error('Erro: Token de verificação inválido.');
      return res.status(403).send('Token de verificação inválido');
    }
  }
  console.error('Erro: Requisição inválida.');
  res.status(400).send('Requisição inválida');
};

module.exports = { uploadPublicKey, handleFlow, validateWebhook };