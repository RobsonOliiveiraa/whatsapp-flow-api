const express = require('express');
const { handleFlow, uploadPublicKey, validateWebhook } = require('../controllers/flowController');

const router = express.Router();

// Endpoint para processar o fluxo
router.post('/', handleFlow);

// Endpoint para upload da chave pública
router.post('/upload-key', uploadPublicKey);

// Endpoint para validação do webhook
router.get('/webhook', validateWebhook);

module.exports = router;