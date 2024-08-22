const express = require('express');
const app = express();
const Cadastros = require('./routes/cadastros');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const pool = require('./config/dbConfig'); // Importe o pool de conexões do db.js
const dotenv = require('dotenv');

dotenv.config();

console.log(process.env.DB_HOST);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_NAME);

const port = process.env.PORT || 4000;
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }));

app.use(express.json());

app.use('/api', Cadastros);

// Configuração para servir arquivos estáticos da pasta public/images
app.use('/images', express.static(path.join(__dirname, 'public/images')));


app.use(errorHandler);

app.use((req, res, next) => {
  req.pool = pool;
  next();
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});