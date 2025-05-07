const express = require('express');
const flowRoutes = require('./routes/flowRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Permitir JSON no corpo da requisição
app.use('/api/flows', flowRoutes);

app.use((req, res) => {
  res.status(404).send({ message: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
  console.error('Erro no servidor:', err);
  res.status(500).send({ message: 'Erro interno no servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});