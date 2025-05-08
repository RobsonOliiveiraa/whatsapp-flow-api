const crypto = require('crypto');

const appSecret = '71151079bb41abd69608ae0b28f2f815'; // Substitua pelo seu APP_SECRET
const accessToken = 'EAATK06J9ZAV8BO3KZCU6TGqAlqXbBoSeraYsal8W2IUrcfbXZCX1R9ZBffCZAkVdHV3FK4auGeETVdmfvbEPWZCsGiJSdAPhOrDARKQNkA1LPwIVzj0yZA0CZAHfQHWExvZCBnu6bVyPrX2OiAjYAmVwYtNgfphTcPxWdRZCscjXzF842tcWlaLkpHqITCi35ZBvBLryVGVmIRn3niZAgEOLZA3QnHtgE4PlHUAZDZD';
const appsecretProof = crypto
  .createHmac('sha256', appSecret)
  .update(accessToken)
  .digest('hex');

console.log('appsecret_proof:', appsecretProof);