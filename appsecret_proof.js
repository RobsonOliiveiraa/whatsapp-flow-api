const crypto = require('crypto');

const appSecret = '71151079bb41abd69608ae0b28f2f815'; // Substitua pelo seu APP_SECRET
const accessToken = 'EAATK06J9ZAV8BO8h623LXZCU4eJNT4tHsdlFievYoq53QYdGOmEL2kY1JDKgUxVojZAZCDKLq08QIxgrAcZAKwFNM1YiDPBzvlHq6KaN7x3IZB4AOuHMKN0QIMT2qdRkK9ZCdUi1UbC7M10sDSkApYkMfucgU2nBNl8fLscUt4ry6OZCIElMoYfZCDPBwv6J7ztlJof21WK533ZAbBRuqF0efIEZCf6Pabs5QZDZD';

const appsecretProof = crypto
  .createHmac('sha256', appSecret)
  .update(accessToken)
  .digest('hex');

console.log('appsecret_proof:', appsecretProof);