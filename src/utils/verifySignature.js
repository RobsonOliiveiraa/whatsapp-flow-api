const crypto = require('crypto');

const verifySignature = (signature, body, publicKey) => {
  if (!publicKey) {
    console.error('Chave pública não carregada');
    return false;
  }

  const verifier = crypto.createVerify('sha256');
  verifier.update(JSON.stringify(body));
  verifier.end();

  try {
    return verifier.verify(publicKey, signature, 'base64');
  } catch (err) {
    console.error('Erro ao verificar assinatura:', err);
    return false;
  }
};

module.exports = verifySignature;