const crypto = require('crypto');

const appSecret = '71151079bb41abd69608ae0b28f2f815'; // Substitua pelo seu APP_SECRET
const accessToken = 'EAATK06J9ZAV8BO8IOy36buyU66bmN49qSaDCap3HopMJMaTA4m1ic2SVsfslF6uqqcZA5FvRhAU7NmViPfDtTn9tAeBf2KpEAATK06J9ZAV8BOZBDfX6KzqBkWLjL87BBHbNZBSAUK2ZCSqBk102Rw9kFCKGhZBG0ttwZBzRIMBL9yvZCvZBKUFQkd3vp1v8VMVZBzYXsTeCkKWPbci0wVHoY1wVscZC6jZAul8MI3vbLZCDZCbS5wIqNKpIoKoGRavlUrKBLMDtiapngovlZCDv3CXnOSxQVDJg8qRiv5KUsmaJLZBgV6itCaJz6aIILHsQylh2gZDZD';
const appsecretProof = crypto
  .createHmac('sha256', appSecret)
  .update(accessToken)
  .digest('hex');

console.log('appsecret_proof:', appsecretProof);