const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const axios = require('axios'); // Adicionado para realizar requisições HTTP

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

// Carregar a chave pública do arquivo
const publicKeyPath = path.join(__dirname, '../../public_key.pem');
if (!fs.existsSync(publicKeyPath)) {
  console.error('Erro: Arquivo public_key.pem não encontrado.');
  process.exit(1); // Finaliza o processo caso o arquivo não seja encontrado
}
publicKey = fs.readFileSync(publicKeyPath, 'utf8');

// Middleware para validar a assinatura das mensagens recebidas
const verifySignature = (req, res, next) => {
  const signature = req.headers['x-hub-signature-256']; // Cabeçalho enviado pelo Facebook
  const payload = JSON.stringify(req.body); // Corpo da requisição
  const APP_SECRET = process.env.APP_SECRET; // Defina o APP_SECRET no .env

  if (!signature) {
    console.error('Erro: Assinatura não encontrada no cabeçalho.');
    return res.status(403).send('Assinatura não encontrada');
  }

  // Gerar a assinatura esperada
  const expectedSignature = `sha256=${crypto
    .createHmac('sha256', APP_SECRET)
    .update(payload)
    .digest('hex')}`;

  // Comparar a assinatura recebida com a esperada
  if (signature !== expectedSignature) {
    console.error('Erro: Assinatura inválida.');
    return res.status(403).send('Assinatura inválida');
  }

  console.log('Assinatura válida.');
  next(); // Prosseguir para o próximo middleware ou rota
};

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

    if (!payload.action) {
      console.error('Erro: Campo "action" ausente no payload.');
      return res.status(400).send('Campo "action" ausente');
    }
    if (!payload.flow_token) {
      console.error('Erro: Campo "flow_token" ausente no payload.');
      return res.status(400).send('Campo "flow_token" ausente');
    }
    if (!payload.version) {
      console.error('Erro: Campo "version" ausente no payload.');
      return res.status(400).send('Campo "version" ausente');
    }

    const SCREEN_RESPONSES = {
      INICIO: {
        screen: "ESCOLHA_TIPO_BOLO",
        data: {},
      },
      ESCOLHA_TIPO_BOLO: {
        screen: "ESCOLHA_BOLO_CASAMENTO",
        data: {},
      },
      ESCOLHA_BOLO_CASAMENTO: {
        screen: "SUCCESS",
        data: {
          extension_message_response: {
            params: {
              flow_token: "REPLACE_FLOW_TOKEN",
              some_param_name: "PASS_CUSTOM_VALUE",
            },
          },
        },
      },
    };

    const currentScreen = payload.screen;
    const response = SCREEN_RESPONSES[currentScreen];

    if (!response) {
      console.error('Erro: Tela atual não encontrada nas respostas.');
      return res.status(400).send('Tela inválida');
    }

    const encryptedResponse = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(JSON.stringify(response))
    );

    res.status(200).send({ encrypted_response: encryptedResponse.toString('base64') });
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
  console.log('Requisição recebida no webhook:', req.query);

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('Token esperado:', process.env.VERIFY_TOKEN); // Log para depuração
  console.log('Token recebido:', token); // Log para depuração

  if (mode && token) {
    if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
      console.log('Webhook validado com sucesso!');
      return res.status(200).send(challenge); // Retorna o desafio para o Facebook
    } else {
      console.error('Erro: Token de verificação inválido.');
      return res.status(403).send('Token de verificação inválido');
    }
  }
  console.error('Erro: Requisição inválida.');
  res.status(400).send('Requisição inválida');
};

const signFlow = (req, res) => {
  const flowData = req.body;

  if (!flowData) {
    console.error('Erro: JSON do fluxo não fornecido.');
    return res.status(400).send('JSON do fluxo não fornecido');
  }

  try {
    console.log('JSON do fluxo recebido:', flowData);

    // Serializar o JSON do fluxo
    const flowString = JSON.stringify(flowData);

    // Assinar o JSON do fluxo usando a chave privada
    const signature = crypto.sign("sha256", Buffer.from(flowString), {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    });

    const signatureBase64 = signature.toString('base64');
    console.log('Assinatura gerada (Base64):', signatureBase64);

    // Retornar a assinatura para o Facebook
    res.status(200).send({ signature: signatureBase64 });
  } catch (error) {
    console.error('Erro ao assinar o JSON do fluxo:', error);
    res.status(500).send('Erro ao assinar o JSON do fluxo');
  }
};

// Função para enviar a chave pública e a assinatura ao Facebook
const sendPublicKeyToFacebook = async () => {
  try {
    console.log('Iniciando o envio da chave pública para o Facebook...');

    // Carrega as variáveis de ambiente
    const appSecret = process.env.APP_SECRET;
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    const businessId = process.env.FACEBOOK_BUSINESS_ID;

    console.log('APP_SECRET:', appSecret ? 'Carregado com sucesso' : 'Não encontrado');
    console.log('FACEBOOK_ACCESS_TOKEN:', accessToken ? 'Carregado com sucesso' : 'Não encontrado');
    console.log('FACEBOOK_BUSINESS_ID:', businessId ? 'Carregado com sucesso' : 'Não encontrado');

    // Gera o appsecret_proof
    console.log('Gerando o appsecret_proof...');
    const appsecretProof = crypto
      .createHmac('sha256', appSecret)
      .update(accessToken)
      .digest('hex');
    console.log('appsecret_proof gerado:', appsecretProof);

    // Carrega a chave pública
    console.log('Carregando a chave pública...');
    const publicKeyPath = path.join(__dirname, '../../public_key.pem');
    if (!fs.existsSync(publicKeyPath)) {
      console.error('Erro: Arquivo public_key.pem não encontrado.');
      return;
    }
    const publicKey = fs.readFileSync(publicKeyPath, 'utf8');
    console.log('Chave pública carregada com sucesso.');

    // Envia a chave pública para o Facebook
    console.log('Enviando a chave pública para o Facebook...');
    const response = await axios.post(
      `https://graph.facebook.com/v22.0/${businessId}/encryption_keys`,
      {
        encryption_key: publicKey,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        params: {
          appsecret_proof: appsecretProof,
        },
      }
    );

    console.log('Chave pública enviada com sucesso:', response.data);
  } catch (error) {
    console.error('Erro ao enviar a chave pública para o Facebook:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados do erro:', error.response.data);
    } else {
      console.error('Mensagem de erro:', error.message);
    }
  }
};

sendPublicKeyToFacebook();

module.exports = { uploadPublicKey, handleFlow, validateWebhook, signFlow, verifySignature, sendPublicKeyToFacebook };