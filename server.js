const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const crypto = require('crypto');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/flow-endpoint', (req, res) => {
  const flowData = req.body;

  console.log('Dados recebidos:', JSON.stringify(flowData, null, 2));

  // Resposta obrigatória
  res.json({
    status: 'ok'
  });
});

app.get('/', (req, res) => {
  res.send('API do WhatsApp Flow está rodando!');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
