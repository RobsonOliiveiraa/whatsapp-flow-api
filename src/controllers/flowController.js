const fs = require('fs');
const path = require('path');
const verifySignature = require('../utils/verifySignature');

let publicKey = ''; // Variável para armazenar a chave pública em memória

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
  const signature = req.headers['x-hub-signature-256'];
  const body = req.body;

  // Carregar a chave pública do arquivo, se não estiver em memória
  if (!publicKey) {
    const filePath = path.join(__dirname, '../../public_key.pem');
    if (fs.existsSync(filePath)) {
      publicKey = fs.readFileSync(filePath, 'utf8');
    } else {
      return res.status(500).send('Chave pública não encontrada');
    }
  }

  if (!verifySignature(signature, body, publicKey)) {
    return res.status(401).send('Assinatura inválida');
  }

  console.log('Fluxo recebido:', body);
  res.status(200).send('Fluxo processado com sucesso');
};

module.exports = { uploadPublicKey, handleFlow };