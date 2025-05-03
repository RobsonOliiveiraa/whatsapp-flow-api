const crypto = require('crypto');

const verifySignature = (signature, body, publicKey) => {
  if (!publicKey) {
    console.error('Chave pública não carregada');
    return false;
  }

  console.log('Chave pública carregada:', publicKey);
  console.log('Corpo da requisição recebido:', JSON.stringify(body));
  console.log('Assinatura recebida:', signature);

  const verifier = crypto.createVerify('sha256');
  verifier.update(JSON.stringify(body));
  verifier.end();

  try {
    const isValid = verifier.verify(publicKey, signature, 'base64');
    console.log('Assinatura válida:', isValid);
    return isValid;
  } catch (err) {
    console.error('Erro ao verificar assinatura:', err);
    return false;
  }
};

module.exports = verifySignature;