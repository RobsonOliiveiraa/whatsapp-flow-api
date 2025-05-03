const crypto = require('crypto');

const body = JSON.stringify({
  example: "dados do fluxo"
}); // Substitua pelo corpo da requisição
const secret = "sua-chave-privada"; // Substitua pela chave privada correspondente à chave pública

const hash = crypto.createHmac('sha256', secret).update(body).digest('hex');
console.log(`x-hub-signature-256: sha256=${hash}`);