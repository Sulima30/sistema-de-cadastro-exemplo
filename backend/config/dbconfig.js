const mysql = require('mysql2/promise');

// Configurações de conexão do banco de dados

const dbConfig = {
    host: '',
    user: '',
    password: '',
    database: ''
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;
