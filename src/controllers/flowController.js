const fs = require('fs');
const path = require('path');
const verifySignature = require('../utils/verifySignature');

let publicKey = ''; // Variável para armazenar a chave pública

// Função para upload da chave pública
const uploadPublicKey = (req, res) => {
  const { key } = req.body;

  if (!key) {
    return res.status(400).send('Chave pública não fornecida');
  }

  // Salvar a chave pública em memória ou em um arquivo
  publicKey = key;
  fs.writeFileSync(path.join(__dirname, '../../publicKey.pem'), key);

  res.status(200).send('Chave pública carregada com sucesso');
};

// Função para processar o fluxo
const handleFlow = (req, res) => {
  const signature = req.headers['x-hub-signature-256'];
  const body = req.body;

  if (!verifySignature(signature, body, publicKey)) {
    return res.status(401).send('Assinatura inválida');
  }

  // Processar o fluxo aqui
  console.log('Fluxo recebido:', body);
  res.status(200).send('Fluxo processado com sucesso');
};

module.exports = { handleFlow, uploadPublicKey };