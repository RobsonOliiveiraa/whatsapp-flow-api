const express = require('express');
const flowRoutes = require('./routes/flowRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Permitir JSON no corpo da requisição
app.use('/api/flows', flowRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});