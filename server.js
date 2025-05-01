// server.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT; // Render exige uso EXATO dessa variável

const VERIFY_TOKEN = 'VERIFY_TOKEN'; // mesmo valor configurado no painel da Meta

app.use(bodyParser.json());

// Rota para validação do webhook da Meta (GET /)
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

// Objeto com as respostas de navegação para cada tela
const SCREEN_RESPONSES = {
  INICIO: { screen: 'INICIO', data: {} },
  ESCOLHA_TIPO_BOLO: { screen: 'ESCOLHA_TIPO_BOLO', data: {} },
  ESCOLHA_BOLO_CASAMENTO: { screen: 'ESCOLHA_BOLO_CASAMENTO', data: {} },
  ESCOLHA_BOLO_PADRAO: { screen: 'ESCOLHA_BOLO_PADRAO', data: {} },
};

// Rota principal que recebe chamadas do Flow (POST /flow-endpoint)
app.post('/flow-endpoint', (req, res) => {
  const screen = req.body?.screen;
  const formData = req.body?.data;

  // Lógica de roteamento baseada no valor do campo "motivo"
  if (screen === 'ESCOLHA_TIPO_BOLO') {
    const motivo = formData?.form_dados_cliente?.motivo?.toLowerCase() || '';

    if (motivo === 'casamento') {
      return res.status(200).json(SCREEN_RESPONSES.ESCOLHA_BOLO_CASAMENTO);
    } else {
      return res.status(200).json(SCREEN_RESPONSES.ESCOLHA_BOLO_PADRAO);
    }
  }

  // Se a tela não precisar de lógica, só reenvia a própria
  if (SCREEN_RESPONSES[screen]) {
    return res.status(200).json(SCREEN_RESPONSES[screen]);
  }

  // Se não reconhecido
  return res.status(400).json({ error: 'Tela não reconhecida.' });
});

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});