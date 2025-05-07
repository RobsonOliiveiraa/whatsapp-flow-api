const crypto = require('crypto');

const appSecret = '71151079bb41abd69608ae0b28f2f815'; // Substitua pelo seu APP_SECRET
const accessToken = 'EAATK06J9ZAV8BO8NAqmgEUjGKIE0yZEAATK06J9ZAV8BOzBewfh5dlHToZATZCqnA5Th1xQ6gObd9wiytYYGnz1ZA7OX8uSQl18xovw9WOoSr8lkpQZChOTGOqw88aty3ZAc9B2c1QTNnKAj5xoucdclZBdGw2GEfJDefUwi9zft6kIZCW32jYkrKCZCXBFrdtmIJZARWyoNx2BFmTCY77JrW8ZBfZAyZAhH8nu0v0d1qJOZBqlyoukNx2EQGBPd7JxlCqOcZD';

const appsecretProof = crypto
  .createHmac('sha256', appSecret)
  .update(accessToken)
  .digest('hex');

console.log('appsecret_proof:', appsecretProof);