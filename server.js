// server.js com suporte à criptografia da Meta
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT;

const VERIFY_TOKEN = 'VERIFY_TOKEN';
const PRIVATE_KEY = fs.readFileSync('./private_key.pem', 'utf8');

app.use(bodyParser.json({ limit: '2mb' }));

// Webhook verification
app.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('🔐 Webhook verificado com sucesso!');
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// Utilitário para descriptografar dados da Meta
function decryptPayload(encrypted_flow_data, encrypted_aes_key, iv) {
  const aesKey = crypto.privateDecrypt(
    {
      key: PRIVATE_KEY,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    Buffer.from(encrypted_aes_key, 'base64')
  );

  const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, Buffer.from(iv, 'base64'));
  let decrypted = decipher.update(Buffer.from(encrypted_flow_data, 'base64'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return JSON.parse(decrypted.toString());
}

// Utilitário para criptografar a resposta
function encryptResponse(responseObj, aesKey, iv) {
  const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, Buffer.from(iv, 'base64'));
  let encrypted = cipher.update(JSON.stringify(responseObj));
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted;
}

// Respostas por tela
const SCREEN_RESPONSES = {
  INICIO: { screen: 'INICIO', data: {} },
  ESCOLHA_TIPO_BOLO: { screen: 'ESCOLHA_TIPO_BOLO', data: {} },
  ESCOLHA_BOLO_CASAMENTO: { screen: 'ESCOLHA_BOLO_CASAMENTO', data: {} },
  ESCOLHA_BOLO_PADRAO: { screen: 'ESCOLHA_BOLO_PADRAO', data: {} },
};

// Endpoint principal com criptografia
app.post('/flow-endpoint', (req, res) => {
  try {
    const { encrypted_flow_data, encrypted_aes_key, initial_vector } = req.body;
    const payload = decryptPayload(encrypted_flow_data, encrypted_aes_key, initial_vector);

    const screen = payload?.screen;
    const formData = payload?.data;

    let responseData;
    if (screen === 'ESCOLHA_TIPO_BOLO') {
      const motivo = formData?.form_dados_cliente?.motivo?.toLowerCase() || '';
      responseData =
        motivo === 'casamento'
          ? SCREEN_RESPONSES.ESCOLHA_BOLO_CASAMENTO
          : SCREEN_RESPONSES.ESCOLHA_BOLO_PADRAO;
    } else {
      responseData = SCREEN_RESPONSES[screen] || { error: 'Tela não reconhecida.' };
    }

    // Recriptografa e envia como resposta
    const aesKey = crypto.privateDecrypt(
      {
        key: PRIVATE_KEY,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(encrypted_aes_key, 'base64')
    );

    const encryptedResponse = encryptResponse(responseData, aesKey, initial_vector);
    res.set('Content-Type', 'application/octet-stream');
    return res.status(200).send(encryptedResponse);
  } catch (err) {
    console.error('Erro ao processar a requisição criptografada:', err);
    return res.sendStatus(500);
  }
});

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
