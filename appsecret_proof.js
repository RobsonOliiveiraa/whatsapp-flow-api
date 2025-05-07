const crypto = require('crypto');

const appSecret = '71151079bb41abd69608ae0b28f2f815'; // Substitua pelo seu APP_SECRET
const accessToken = 'EAATK06J9ZAV8BO18Q1Xr5vggs2izK2LB3PzLq1rIYkVG1NpDCdUAS91t41IScOJSP6oSswMceEk5jPxk6CbsXZBD1NcgtZC5MXKSQAdybuTjuZBW5a5ZBtvUwkwYcPfAfLniZAQWDTTr6KBWPxjzAjyIjRC1b5vBVzZBfQpMOsBLpgj4iRs1ZAl8AO1ZA3j2AhquZBrGYI7wYursbJWrXstVz7xlMz7hD0zQZDZD';

const appsecretProof = crypto
  .createHmac('sha256', appSecret)
  .update(accessToken)
  .digest('hex');

console.log('appsecret_proof:', appsecretProof);