const express = require('express');
const router = express.Router();
const { handleFlow, uploadPublicKey, validateWebhook, signFlow } = require('../controllers/flowController');

// Endpoint para processar o fluxo
router.post('/', handleFlow);

// Endpoint para upload da chave pública
router.post('/upload-key', uploadPublicKey);

// Endpoint para validação do webhook
router.get('/webhook', validateWebhook);

// Rota para assinar o JSON do fluxo
router.post('/sign-flow', signFlow);

module.exports = router;