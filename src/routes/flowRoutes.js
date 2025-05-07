const express = require('express');
const router = express.Router();
const { handleFlow, uploadPublicKey, validateWebhook, signFlow, verifySignature, sendPublicKeyToFacebook } = require('../controllers/flowController');

// Rota para processar o webhook do Facebook
router.post('/webhook', verifySignature, handleFlow);

// Rota para validação inicial do webhook (hub.challenge)
router.get('/webhook', validateWebhook);

// Rota para carregar a chave pública
router.post('/upload-key', uploadPublicKey);

// Rota para assinar o JSON do fluxo
router.post('/sign-flow', signFlow);

// Rota para enviar a chave pública e assinatura ao Facebook
router.post('/send-public-key', sendPublicKeyToFacebook);

module.exports = router;