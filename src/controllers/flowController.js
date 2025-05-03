const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const verifySignature = require('../utils/verifySignature');

let publicKey = ''; // Variável para armazenar a chave pública em memória

// Carregar a chave privada
const privateKeyPath = path.join(__dirname, '../../private_key.pem');
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

const uploadPublicKey = (req, res) => {
  const { key } = req.body;

  if (!key) {
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
    return res.status(400).send('Carga útil criptografada não fornecida');
  }

  try {
    // Descriptografar a carga útil
    const decryptedPayload = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(encryptedPayload, 'base64')
    );

    const payload = JSON.parse(decryptedPayload.toString('utf8'));
    console.log('Payload descriptografado:', payload);

    // Processar o payload
    res.status(200).send('Fluxo processado com sucesso');
  } catch (error) {
    console.error('Erro ao descriptografar a carga útil:', error);
    res.status(500).send('Erro ao processar a carga útil');
  }
};

// Token de verificação definido por você
const VERIFY_TOKEN = "l&Ch1532X_(T";

const validateWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verificado com sucesso!');
      return res.status(200).send(challenge); // Retorna o desafio para o Facebook
    } else {
      return res.status(403).send('Token de verificação inválido');
    }
  }
  res.status(400).send('Requisição inválida');
};

module.exports = { uploadPublicKey, handleFlow, validateWebhook };