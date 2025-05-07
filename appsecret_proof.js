const crypto = require('crypto');

const appSecret = '71151079bb41abd69608ae0b28f2f815'; // Substitua pelo seu APP_SECRET
const accessToken = 'EAATK06J9ZAV8BO8NAqmgEUjGKIE0yZCp5ZCnE00IcQdZA0HnbPUuZAwVzzO0I2kcCWD0ZBZCNKI81H5iBQzEKKA2LBJXqI1YHvOtFLaubMwgoSOZAKoffohsHrO6h7ZBsSzCpkCRoclvG2YGNTCABBkfy5CP5ZAeaohZCuorKMOKgS3uK8O2qcPU3vMUTfT0adaLqTsGrZBglRE7ZACHaBwDFT5hju4Qcuc1JvAZDZD';

const appsecretProof = crypto
  .createHmac('sha256', appSecret)
  .update(accessToken)
  .digest('hex');

console.log('appsecret_proof:', appsecretProof);