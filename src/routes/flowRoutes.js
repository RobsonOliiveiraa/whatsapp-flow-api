const express = require('express');
const router = express.Router();
const { handleFlow, uploadPublicKey, validateWebhook, signFlow, verifySignature } = require('../controllers/flowController');

// Endpoint para processar o fluxo com validação de assinatura
router.post('/webhook', verifySignature, handleFlow);

// Endpoint para validação inicial do webhook (hub.challenge)
router.get('/webhook', validateWebhook);

// Endpoint para upload da chave pública
router.post('/upload-key', uploadPublicKey);

// Endpoint para assinar o JSON do fluxo
router.post('/sign-flow', signFlow);

module.exports = router;