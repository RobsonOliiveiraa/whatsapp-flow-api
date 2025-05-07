const express = require('express');
const router = express.Router();
const { sendPublicKeyToFacebook } = require('../controllers/flowController');

// Rota para enviar a chave pública ao Facebook
router.post('/sendPublicKey', sendPublicKeyToFacebook);

module.exports = router;