const express = require('express');
const flowRoutes = require('./routes/flowRoutes');
require('dotenv').config();

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