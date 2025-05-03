const crypto = require('crypto');

// Corpo da requisição (deve ser exatamente o mesmo enviado no Postman)
const body = JSON.stringify({
  example: "dados do fluxo"
});

// Substitua pela chave privada correspondente à chave pública carregada
const secret = "sua-chave-privada";

// Gerar a assinatura
const hash = crypto.createHmac('sha256', secret).update(body).digest('hex');
console.log(`x-hub-signature-256: sha256=${hash}`);