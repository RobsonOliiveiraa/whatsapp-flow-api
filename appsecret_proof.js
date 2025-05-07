const crypto = require('crypto');

const appSecret = '71151079bb41abd69608ae0b28f2f815'; // Substitua pelo seu APP_SECRET
const accessToken = 'EAATK06J9ZAV8BOzEY8TtYfPNsLNAyh4yM7i41CdtbAOzmCHZB2xzCbEyoQUhgPjTkafAWMirpaoPqDbEQk3WveRhAL7wX5dPqYZAnrETMf4aBZBeasVL5XXVXBuvRsLKHJxkwwRjhpgfSwiZA5ZAZCsZABYUizoTXdchy0V9BVbZAPh8NzZCY2l58vHm1ZCSu0lLpca6osVj5gVBIsZA2c212QWJeBQ7fhQYewZDZD';

const appsecretProof = crypto
  .createHmac('sha256', appSecret)
  .update(accessToken)
  .digest('hex');

console.log('appsecret_proof:', appsecretProof);