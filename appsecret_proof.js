const crypto = require('crypto');

const appSecret = '71151079bb41abd69608ae0b28f2f815'; // Substitua pelo seu APP_SECRET
const accessToken = 'EAATK06J9ZAV8BO8IOy36buyU66bmN49qSaDCap3HopMJMaTA4m1ic2SVsfslF6uqqcZA5FvRhAU7NmViPfDtTn9tAeBf2Kp0ENkQGqJa8hmVy26r5Ej5WAzBjk2WYhvt6XfI5vnoa6hedCHlNfjqYJHY0P4El0AEOdlUGCHkq2imXgIJFCL6GLZB1k62cbUaD0M6jWvqmpP0ZAgnrdXXO9mZBx776tgZDZD';
const appsecretProof = crypto
  .createHmac('sha256', appSecret)
  .update(accessToken)
  .digest('hex');

console.log('appsecret_proof:', appsecretProof);