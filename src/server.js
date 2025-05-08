require('dotenv').config();

const express = require('express');
const flowRoutes = require('./routes/flowRoutes');


console.log('APP_SECRET:', process.env.APP_SECRET ? 'Carregado com sucesso' : 'Não encontrado');
console.log('FACEBOOK_ACCESS_TOKEN:', process.env.FACEBOOK_ACCESS_TOKEN ? 'Carregado com sucesso' : 'Não encontrado');
console.log('FACEBOOK_BUSINESS_ID:', process.env.FACEBOOK_BUSINESS_ID ? 'Carregado com sucesso' : 'Não encontrado');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', flowRoutes);

app.use((err, req, res, next) => {
  console.error('Erro no servidor:', err.stack);
  res.status(500).send('Erro interno no servidor');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});