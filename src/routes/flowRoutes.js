const express = require('express');
const router = express.Router();
const { validateWebhook, handleFlow, sendPublicKeyToFacebook } = require('../controllers/flowController');

// Rota para validação do webhook
router.get('/flows/webhook', validateWebhook);

// Rota para lidar com o fluxo
router.post('/flows/webhook', handleFlow);

// Rota para enviar a chave pública ao Facebook
router.post('/sendPublicKey', sendPublicKeyToFacebook);

module.exports = router;