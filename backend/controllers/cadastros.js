const pool = require('../config/dbConfig')

exports.checkCPF = async (req, res) => {
  const { cpfCliente } = req.params;

  const checkQuery = `SELECT * FROM cadastroClientesPF WHERE cpfCliente = ?`;

  try {
    const [checkResults] = await pool.query(checkQuery, [cpfCliente]);
    if (checkResults.length > 0) {
      return res.status(201).json({ error: 'CPF já cadastrado' });
    }
    res.status(200).json({ message: 'CPF disponível' });
  } catch (error) {
    console.error('Erro ao verificar CPF:', error);
    res.status(500).json({ error: 'Erro ao verificar CPF.' });
  }
};
const multer = require('multer');
const Tesseract = require('tesseract.js');
const upload = multer({ dest: 'uploads/' });

exports.createClientePessoaFisica = async (req, res) => {
  const { cpfCliente, codCliente, dtNascimento, opcaoSexo, opcaoEtnias, nomeCompleto, nomeSocial, tipoEnd, endereco, nrEnd, complementoEnd, cidade, nrCep, tipoUF, telefone, celular, temWhatsApp, email, opcaoPagamento, opcaoCondPagamento, codBanco, nomeBanco, agenciaBancaria, agenciaDV, numeroConta, contaDV } = req.body;

  const query = `INSERT INTO cadastroClientesPF(cpfCliente, codCliente, dtNascimento, opcaoSexo, opcaoEtnias, nomeCompleto, nomeSocial, tipoEnd, endereco, nrEnd, complementoEnd, cidade, nrCep, tipoUF, telefone, celular, temWhatsApp, email, opcaoPagamento, opcaoCondPagamento, codBanco, nomeBanco, agenciaBancaria, agenciaDV, numeroConta, contaDV) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

  try {
    const [results] = await pool.query(query, [
      cpfCliente, codCliente, dtNascimento, opcaoSexo, opcaoEtnias, nomeCompleto, nomeSocial, tipoEnd, endereco, nrEnd, complementoEnd, cidade, nrCep, tipoUF, telefone, celular, temWhatsApp, email, opcaoPagamento, opcaoCondPagamento, codBanco, nomeBanco, agenciaBancaria, agenciaDV, numeroConta, contaDV
    ]);
    res.status(200).json({ message: 'Dados inseridos com sucesso!' });
  } catch (error) {
    console.error('Erro ao inserir dados no banco de dados:', error);
    res.status(500).json({ error: 'Erro ao inserir dados no banco de dados.' });
  }
};

exports.processDocumentImage = async (req, res) => {
  const { path } = req.file;
  Tesseract.recognize(path, 'por', { logger: m => console.log(m) })
    .then(({ data: { text } }) => {
      const extractedData = extractDataFromText(text);
      res.json(extractedData);
    })
    .catch(err => {
      console.error('Erro ao processar a imagem:', err);
      res.status(500).json({ error: 'Erro ao processar a imagem.' });
    });
};

const extractDataFromText = (text) => {
  const cpfMatch = text.match(/\d{3}\.\d{3}\.\d{3}-\d{2}/);
  const nameMatch = text.match(/Nome Completo: (.*)/); // Exemplo fictício, ajuste conforme necessário

  return {
    cpfCliente: cpfMatch ? cpfMatch[0] : null,
    nomeCompleto: nameMatch ? nameMatch[1] : null,
  };
};

exports.createClientePessoaJuridica = async (req, res) => {
  const { porte, atuacao, segmentoAtuacao, cnpj, codCliente, dtAbertura, razaoSocial, nomeFantasia, temIE, nrInscEstadual, temIM, nrInscMunicipal, cnae, descCnae, tipoEnd, endereco, nrEnd, complementoEnd, cidade, nrCep, tipoUF, telefone, celular, temWhatsApp, email, tipoPgto, tipoCondPgto, codBanco, nomeBanco, agenciaBancaria, agenciaDV, numeroConta, contaDV } = req.body;

  const query = `INSERT INTO cadastroclientepj( porte, atuacao, segmentoAtuacao, cnpj, codCliente, dtAbertura, razaoSocial, nomeFantasia, temIE, nrInscEstadual, temIM, nrInscMunicipal, cnae, descCnae, tipoEnd, endereco, nrEnd, complementoEnd, cidade, nrCep, tipoUF, telefone, celular, temWhatsApp, email, tipoPgto, tipoCondPgto, codBanco, nomeBanco, agenciaBancaria, agenciaDV, numeroConta, contaDV) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

  try {
    const [results] = await pool.query(query, [
      porte, atuacao, segmentoAtuacao, cnpj, codCliente, dtAbertura, razaoSocial, nomeFantasia, temIE, nrInscEstadual, temIM, nrInscMunicipal, cnae, descCnae, tipoEnd, endereco, nrEnd, complementoEnd, cidade, nrCep, tipoUF, telefone, celular, temWhatsApp, email, tipoPgto, tipoCondPgto, codBanco, nomeBanco, agenciaBancaria, agenciaDV, numeroConta, contaDV
    ]);
    res.status(200).json({ message: 'Dados inseridos com sucesso!' });
  } catch (error) {
    console.error('Erro ao inserir dados no banco de dados:', error);
    res.status(500).json({ error: 'Erro ao inserir dados no banco de dados.' });
  }
};


exports.getAllClientes = async (req, res) => {
  try {
    const query = `
      SELECT 
        codCliente, 
        nomeCliente, 
        tipoEnd, 
        endereco, 
        nrEnd, 
        complementoEnd, 
        cidade, 
        nrCep, 
        tipoUF, 
        telefone, 
        celular, 
        temWhatsApp, 
        email 
      FROM (
        SELECT 
          codCliente, 
          nomeCompleto AS nomeCliente, 
          tipoEnd, 
          endereco, 
          nrEnd, 
          complementoEnd, 
          cidade, 
          nrCep, 
          tipoUF, 
          telefone, 
          celular, 
          temWhatsApp, 
          email 
        FROM cadastroClientesPF
        UNION
        SELECT 
          codCliente, 
          razaoSocial AS nomeCliente, 
          tipoEnd, 
          endereco, 
          nrEnd, 
          complementoEnd, 
          cidade, 
          nrCep, 
          tipoUF, 
          telefone, 
          celular, 
          temWhatsApp, 
          email 
        FROM cadastroClientePJ
      ) AS clientes
    `;

    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar todos os clientes:', error);
    res.status(500).send('Erro ao buscar todos os clientes');
  }
}

exports.getMovimentacoes = async (req, res) => {
  const { page = 1, limit = 10, search = '', tipo = '' } = req.query;
  const offset = (page - 1) * parseInt(limit);
  let whereClause = 'WHERE 1=1';

  const queryParams = [];

  if (search) {
    whereClause += ` AND codCliente LIKE ?`;
    queryParams.push(`%${search}%`);
  }
  if (tipo) {
    whereClause += ` AND nomeCompleto = ?`;
    queryParams.push(tipo);
  }

  try {
    const [movimentacoes] = await pool.query(
      `SELECT * FROM cadastroClientesPF ${whereClause} LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), offset]
    );

    const [total] = await pool.query(
      `SELECT COUNT(*) as count FROM cadastroClientesPF ${whereClause}`,
      queryParams
    );

    res.json({ movimentacoes, total: total[0].count });
  } catch (err) {
    console.error('Erro ao buscar movimentações:', err);
    res.status(500).json({ error: 'Erro ao buscar movimentações.' });
  }
};

exports.getmovimentacoesPJ = async (req, res) => {
  const { page = 1, limit = 10, search = '', tipo = '' } = req.query;
  const offset = (page - 1) * parseInt(limit);
  let whereClause = 'WHERE 1=1';

  const queryParams = [];

  if (search) {
    whereClause += ` AND codCliente LIKE ?`;
    queryParams.push(`%${search}%`);
  }
  if (tipo) {
    whereClause += ` AND razaoSocial = ?`;
    queryParams.push(tipo);
  }

  try {
    const [movimentacoes] = await pool.query(
      `SELECT * FROM cadastroclientepj ${whereClause} LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), offset]
    );

    const [total] = await pool.query(
      `SELECT COUNT(*) as count FROM cadastroclientepj ${whereClause}`,
      queryParams
    );

    res.json({ movimentacoes, total: total[0].count });
  } catch (err) {
    console.error('Erro ao buscar movimentações:', err);
    res.status(500).json({ error: 'Erro ao buscar movimentações.' });
  }
};

exports.getAllClientesPesquisar = async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const offset = (page - 1) * parseInt(limit);
  let whereClause = 'WHERE 1=1';
  const queryParams = [];

  if (search) {
    whereClause += ` AND (codCliente LIKE ? OR nomeCliente LIKE ?)`;
    queryParams.push(`%${search}%`, `%${search}%`);
  }

  const query = `
    SELECT 
      codCliente, 
      nomeCliente, 
      telefone, 
      celular, 
      email, 
      cidade,
      tipoUF,
      tipoCliente
    FROM (
      SELECT 
        codCliente, 
        nomeCompleto AS nomeCliente, 
        telefone, 
        celular, 
        email, 
        cidade,
        tipoUF,
        'Pessoa Física' AS tipoCliente
      FROM cadastroClientesPF
      ${whereClause}
      UNION
      SELECT 
        codCliente, 
        razaoSocial AS nomeCliente, 
        telefone, 
        celular, 
        email, 
        cidade,
        tipoUF,
        'Pessoa Jurídica' AS tipoCliente
      FROM cadastroclientepj
      ${whereClause}
    ) AS clientes
    LIMIT ? OFFSET ?
  `;

  const totalQuery = `
    SELECT COUNT(*) as count 
    FROM (
      SELECT codCliente FROM cadastroClientesPF ${whereClause}
      UNION ALL
      SELECT codCliente FROM cadastroclientepj ${whereClause}
    ) AS total
  `;

  try {
    const [movimentacoes] = await pool.query(query, [...queryParams, parseInt(limit), offset]);
    const [total] = await pool.query(totalQuery, queryParams);

    res.json({ movimentacoes, total: total[0].count });
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.updateClientePF = async (req, res) => {
  console.log('Chegou na rota /updateClientePF');
  console.log('Req params:', req.params);
  console.log('Req body:', req.body);

  const { codCliente } = req.params;
  const {
    nomeCompleto, cpfCliente, dtNascimento, opcaoSexo, opcaoEtnias,
    nomeSocial, tipoEnd, endereco, nrEnd, complementoEnd, cidade, nrCep,
    tipoUF, telefone, celular, temWhatsApp, email, opcaoPagamento,
    opcaoCondPagamento, codBanco, nomeBanco, agenciaBancaria, agenciaDV,
    numeroConta, contaDV
  } = req.body;

  const query = `
    UPDATE cadastroClientesPF
    SET nomeCompleto = ?, cpfCliente = ?, dtNascimento = ?, opcaoSexo = ?, opcaoEtnias = ?,
        nomeSocial = ?, tipoEnd = ?, endereco = ?, nrEnd = ?, complementoEnd = ?, cidade = ?, 
        nrCep = ?, tipoUF = ?, telefone = ?, celular = ?, temWhatsApp = ?, email = ?,opcaoPagamento = ?,
    opcaoCondPagamento  = ?, codBanco  = ?, nomeBanco  = ?, agenciaBancaria  = ?, agenciaDV  = ?,
    numeroConta  = ?, contaDV  = ?
    WHERE codCliente = ?`;

  try {
    const [results] = await pool.query(query, [
      nomeCompleto, cpfCliente, dtNascimento, opcaoSexo, opcaoEtnias,
      nomeSocial, tipoEnd, endereco, nrEnd, complementoEnd, cidade, nrCep,
      tipoUF, telefone, celular, temWhatsApp, email, opcaoPagamento,
      opcaoCondPagamento, codBanco, nomeBanco, agenciaBancaria, agenciaDV,
      numeroConta, contaDV, codCliente
    ]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado.' });
    }

    res.status(200).json({ message: 'Dados do cliente atualizados com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar dados do cliente no banco de dados:', error);
    res.status(500).json({ error: 'Erro ao atualizar dados do cliente no banco de dados.' });
  }
};

exports.updateClientePJ = async (req, res) => {
  console.log('Chegou na rota /updateClientePJ');
  console.log('Req params:', req.params);
  console.log('Req body:', req.body);

  const { codCliente } = req.params;
  const {
    porte, atuacao, segmentoAtuacao, cnpj, dtAbertura, razaoSocial, nomeFantasia, temIE, nrInscEstadual, temIM, nrInscMunicipal, cnae, descCnae, tipoEnd, endereco, nrEnd, complementoEnd, cidade, nrCep, tipoUF, telefone, celular, temWhatsApp, email, tipoPgto, tipoCondPgto, codBanco, nomeBanco, agenciaBancaria, agenciaDV, numeroConta, contaDV
  } = req.body;

  const query = `
    UPDATE cadastroClientePJ
    SET porte = ?, atuacao = ?, segmentoAtuacao = ?, cnpj = ?, dtAbertura=?, razaoSocial = ?, nomeFantasia = ? , temIE = ? , nrInscEstadual = ? , temIM = ? , nrInscMunicipal = ? , cnae = ?, descCnae = ? , tipoEnd = ?, endereco = ?, nrEnd = ?, complementoEnd = ?, cidade = ?, nrCep = ?, tipoUF = ?, telefone = ?, celular = ?, temWhatsApp = ?, email = ?, tipoPgto = ?,
    tipoCondPgto  = ?, codBanco  = ?, nomeBanco  = ?, agenciaBancaria  = ?, agenciaDV  = ?,
    numeroConta  = ?, contaDV  = ?
    WHERE codCliente = ?`;

  try {
    const [results] = await pool.query(query, [
      porte, atuacao, segmentoAtuacao, cnpj, dtAbertura, razaoSocial, nomeFantasia, temIE, nrInscEstadual, temIM, nrInscMunicipal, cnae, descCnae, tipoEnd, endereco, nrEnd, complementoEnd, cidade, nrCep, tipoUF, telefone, celular, temWhatsApp, email, tipoPgto, tipoCondPgto, codBanco, nomeBanco, agenciaBancaria, agenciaDV,
      numeroConta, contaDV, codCliente
    ]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado.' });
    }

    res.status(200).json({ message: 'Dados do cliente atualizados com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar dados do cliente no banco de dados:', error);
    res.status(500).json({ error: 'Erro ao atualizar dados do cliente no banco de dados.' });
  }
};

exports.getClienteByCodCliente = async (req, res) => {
  // Obtém o codCliente dos parâmetros da requisição
  const { codCliente } = req.params;

  // Construa a consulta SQL para buscar os detalhes do cliente pelo codCliente
  const query = 'SELECT * FROM cadastroClientesPF WHERE codCliente = ?';

  try {
    // Execute a consulta SQL usando o pool de conexão
    const [results] = await pool.query(query, [codCliente]);

    // Verifique se algum cliente foi encontrado
    if (results.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado.' });
    }

    // Cliente encontrado, retorne os detalhes do cliente
    res.status(200).json(results[0]);
  } catch (error) {
    console.error('Erro ao obter cliente do banco de dados:', error);
    res.status(500).json({ error: 'Erro ao obter cliente do banco de dados.' });
  }
};

exports.getClienteByCodClientePJ = async (req, res) => {
  // Obtém o codCliente dos parâmetros da requisição
  const { codCliente } = req.params;

  // Construa a consulta SQL para buscar os detalhes do cliente pelo codCliente
  const query = 'SELECT * FROM cadastroClientePJ WHERE codCliente = ?';

  try {
    // Execute a consulta SQL usando o pool de conexão
    const [results] = await pool.query(query, [codCliente]);

    // Verifique se algum cliente foi encontrado
    if (results.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado.' });
    }

    // Cliente encontrado, retorne os detalhes do cliente
    res.status(200).json(results[0]);
  } catch (error) {
    console.error('Erro ao obter cliente do banco de dados:', error);
    res.status(500).json({ error: 'Erro ao obter cliente do banco de dados.' });
  }
};

// Fornecedores - Cadastros e Pesquisas 

exports.createFornecedor = async (req, res) => {
  const { porte, atuacao, segmentoAtuacao, cnpj, codCliente, dtAbertura, razaoSocial, nomeFantasia, temIE, nrInscEstadual, temIM, nrInscMunicipal, cnae, descCnae, tipoEnd, endereco, nrEnd, complementoEnd, cidade, nrCep, tipoUF, telefone, celular, temWhatsApp, email, tipoPgto, tipoCondPgto, codBanco, nomeBanco, agenciaBancaria, agenciaDV, numeroConta, contaDV } = req.body;

  const query = `INSERT INTO cadastroFornecedor( porte, atuacao, segmentoAtuacao, cnpj, codCliente, dtAbertura, razaoSocial, nomeFantasia, temIE, nrInscEstadual, temIM, nrInscMunicipal, cnae, descCnae, tipoEnd, endereco, nrEnd, complementoEnd, cidade, nrCep, tipoUF, telefone, celular, temWhatsApp, email, tipoPgto, tipoCondPgto, codBanco, nomeBanco, agenciaBancaria, agenciaDV, numeroConta, contaDV) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

  try {
    const [results] = await pool.query(query, [porte, atuacao, segmentoAtuacao, cnpj, codCliente, dtAbertura, razaoSocial, nomeFantasia, temIE, nrInscEstadual, temIM, nrInscMunicipal, cnae, descCnae, tipoEnd, endereco, nrEnd, complementoEnd, cidade, nrCep, tipoUF, telefone, celular, temWhatsApp, email, tipoPgto, tipoCondPgto, codBanco, nomeBanco, agenciaBancaria, agenciaDV, numeroConta, contaDV
    ]);
    res.status(200).json({ message: 'Dados inseridos com sucesso!' });
  } catch (error) {
    console.error('Erro ao inserir dados no banco de dados:', error);
    res.status(500).json({ error: 'Erro ao inserir dados no banco de dados.' });
  }

};


exports.getAllFornecedores = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT cnpj, nomeFantasia FROM cadastroFornecedor');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar todos os fornecedores:', error);
    res.status(500).send('Erro ao buscar todos os fornecedores');
  }
}

exports.getmovimentacoes = async (req, res) => {
  const { page = 1, limit = 10, search = '', tipo = '' } = req.query;
  const offset = (page - 1) * parseInt(limit);
  let whereClause = 'WHERE 1=1';

  const queryParams = [];

  if (search) {
    whereClause += ` AND codCliente LIKE ?`;
    queryParams.push(`%${search}%`);
  }
  if (tipo) {
    whereClause += ` AND razaoSocial = ?`;
    queryParams.push(tipo);
  }

  try {
    const [movimentacoes] = await pool.query(
      `SELECT * FROM cadastrofornecedor ${whereClause} LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), offset]
    );

    const [total] = await pool.query(
      `SELECT COUNT(*) as count FROM cadastrofornecedor ${whereClause}`,
      queryParams
    );

    res.json({ movimentacoes, total: total[0].count });
  } catch (err) {
    console.error('Erro ao buscar movimentações:', err);
    res.status(500).json({ error: 'Erro ao buscar movimentações.' });
  }
};

exports.updateFornecedor = async (req, res) => {
  console.log('Chegou na rota /updateFornecedor');
  console.log('Req params:', req.params);
  console.log('Req body:', req.body);

  const { codCliente } = req.params;
  const {
    porte, atuacao, segmentoAtuacao, cnpj, dtAbertura, razaoSocial, nomeFantasia, temIE, nrInscEstadual, temIM, nrInscMunicipal, cnae, descCnae, tipoEnd, endereco, nrEnd, complementoEnd, cidade, nrCep, tipoUF, telefone, celular, temWhatsApp, email, tipoPgto, tipoCondPgto, codBanco, nomeBanco, agenciaBancaria, agenciaDV, numeroConta, contaDV
  } = req.body;

  const query = `
    UPDATE cadastrofornecedor
    SET porte = ?, atuacao = ?, segmentoAtuacao = ?, cnpj = ?, dtAbertura=?, razaoSocial = ?, nomeFantasia = ? , temIE = ? , nrInscEstadual = ? , temIM = ? , nrInscMunicipal = ? , cnae = ?, descCnae = ? , tipoEnd = ?, endereco = ?, nrEnd = ?, complementoEnd = ?, cidade = ?, nrCep = ?, tipoUF = ?, telefone = ?, celular = ?, temWhatsApp = ?, email = ?, tipoPgto = ?,
    tipoCondPgto  = ?, codBanco  = ?, nomeBanco  = ?, agenciaBancaria  = ?, agenciaDV  = ?,
    numeroConta  = ?, contaDV  = ?
    WHERE codCliente = ?`;

  try {
    const [results] = await pool.query(query, [
      porte, atuacao, segmentoAtuacao, cnpj, dtAbertura, razaoSocial, nomeFantasia, temIE, nrInscEstadual, temIM, nrInscMunicipal, cnae, descCnae, tipoEnd, endereco, nrEnd, complementoEnd, cidade, nrCep, tipoUF, telefone, celular, temWhatsApp, email, tipoPgto, tipoCondPgto, codBanco, nomeBanco, agenciaBancaria, agenciaDV,
      numeroConta, contaDV, codCliente
    ]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado.' });
    }

    res.status(200).json({ message: 'Dados do cliente atualizados com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar dados do cliente no banco de dados:', error);
    res.status(500).json({ error: 'Erro ao atualizar dados do cliente no banco de dados.' });
  }
};
exports.getClienteByFornecedor = async (req, res) => {
  // Obtém o codCliente dos parâmetros da requisição
  const { codCliente } = req.params;

  // Construa a consulta SQL para buscar os detalhes do cliente pelo codCliente
  const query = 'SELECT * FROM cadastrofornecedor WHERE codCliente = ?';

  try {
    // Execute a consulta SQL usando o pool de conexão
    const [results] = await pool.query(query, [codCliente]);

    // Verifique se algum cliente foi encontrado
    if (results.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado.' });
    }

    // Cliente encontrado, retorne os detalhes do cliente
    res.status(200).json(results[0]);
  } catch (error) {
    console.error('Erro ao obter cliente do banco de dados:', error);
    res.status(500).json({ error: 'Erro ao obter cliente do banco de dados.' });
  }
};