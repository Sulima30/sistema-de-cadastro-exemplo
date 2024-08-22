const express = require('express');
const router = express.Router();
const Cadastros = require('../controllers/cadastros');

router.post('/cadastroPessoaFisica', Cadastros.createClientePessoaFisica);
router.post('/Cadastrar-Cliente-PJ', Cadastros.createClientePessoaJuridica);
router.get('/todos-os-clientes', Cadastros.getAllClientes);
router.get('/checkCPF/:cpfCliente', Cadastros.checkCPF);
router.get('/Pesquisar-Clientes-PF', Cadastros.getMovimentacoes);
router.get('/Pesquisar-Clientes-PJ', Cadastros.getmovimentacoesPJ);
router.get('/Pesquisar-Clientes', Cadastros.getAllClientesPesquisar);
router.put('/Atualizar-Cliente/:codCliente', Cadastros.updateClientePF);
router.put('/Atualizar-Cliente-PJ/:codCliente', Cadastros.updateClientePJ);
router.get('/getCliente/:codCliente', Cadastros.getClienteByCodCliente);
router.get('/getClientePJ/:codCliente', Cadastros.getClienteByCodClientePJ);

router.post('/cadastro-fornecedor', Cadastros.createFornecedor);
router.get('/todos-fornecedores', Cadastros.getAllFornecedores);
router.get('/Pesquisar-Fornecedores', Cadastros.getmovimentacoes);

router.put('/Atualizar-Fornecedor/:codCliente', Cadastros.updateFornecedor);
router.get('/getFornecedor/:codCliente', Cadastros.getClienteByFornecedor)

module.exports = router;