// server.js com node-forge para descriptografar RSA OAEP SHA-256
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const forge = require('node-forge');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT;

const VERIFY_TOKEN = 'VERIFY_TOKEN';
const PRIVATE_KEY_PEM = fs.readFileSync('./private_key.pem', 'utf8');

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

// Descriptografar com node-forge
function decryptPayload(encrypted_flow_data, encrypted_aes_key, iv) {
  const privateKey = forge.pki.privateKeyFromPem(PRIVATE_KEY_PEM);
  const aesKey = privateKey.decrypt(
    forge.util.decode64(encrypted_aes_key),
    'RSA-OAEP',
    {
      md: forge.md.sha256.create(),
      mgf1: { md: forge.md.sha256.create() }
    }
  );

  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(aesKey, 'binary'), Buffer.from(iv, 'base64'));
  let decrypted = decipher.update(Buffer.from(encrypted_flow_data, 'base64'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return JSON.parse(decrypted.toString());
}

function encryptResponse(responseObj, aesKey, iv) {
  const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, Buffer.from(iv, 'base64'));
  let encrypted = cipher.update(JSON.stringify(responseObj));
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted;
}

const SCREEN_RESPONSES = {
  INICIO: { screen: 'INICIO', data: {} },
  ESCOLHA_TIPO_BOLO: { screen: 'ESCOLHA_TIPO_BOLO', data: {} },
  ESCOLHA_BOLO_CASAMENTO: { screen: 'ESCOLHA_BOLO_CASAMENTO', data: {} },
  ESCOLHA_BOLO_PADRAO: { screen: 'ESCOLHA_BOLO_PADRAO', data: {} },
};

app.post('/flow-endpoint', (req, res) => {
  try {
    console.log('📩 Requisição recebida no /flow-endpoint');
    const { encrypted_flow_data, encrypted_aes_key, initial_vector } = req.body;

    console.log('🔐 encrypted_flow_data (base64):', encrypted_flow_data?.slice(0, 50) + '...');
    console.log('🗝️ encrypted_aes_key (base64):', encrypted_aes_key?.slice(0, 50) + '...');
    console.log('🔄 initial_vector (base64):', initial_vector);

    const payload = decryptPayload(encrypted_flow_data, encrypted_aes_key, initial_vector);
    console.log('📥 Payload descriptografado:', payload);

    const screen = payload?.screen;
    const formData = payload?.data;
    console.log('🖥️ Tela solicitada:', screen);

    let responseData;
    if (screen === 'ESCOLHA_TIPO_BOLO') {
      const motivo = formData?.form_dados_cliente?.motivo?.toLowerCase() || '';
      console.log('🎯 Motivo identificado:', motivo);

      responseData =
        motivo === 'casamento'
          ? SCREEN_RESPONSES.ESCOLHA_BOLO_CASAMENTO
          : SCREEN_RESPONSES.ESCOLHA_BOLO_PADRAO;
    } else {
      responseData = SCREEN_RESPONSES[screen] || { error: 'Tela não reconhecida.' };
    }

    const aesKeyBuffer = Buffer.from(payload.aes_key || aesKey, 'binary');
    const encryptedResponse = encryptResponse(responseData, aesKeyBuffer, initial_vector);
    console.log('📤 Resposta criptografada enviada (base64):', encryptedResponse.toString('base64').slice(0, 60) + '...');

    res.set('Content-Type', 'application/octet-stream');
    return res.status(200).send(encryptedResponse);
  } catch (err) {
    console.error('❌ Erro interno ao processar criptografia:', err);
    return res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
