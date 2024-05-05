const express = require('express');
const { cpfUnico } = require('./intermediarios');
const { depositar, sacar, transferir, verSaldo, verExtrato } = require('./controladores/transacoes');
const { listarContas, criarConta, atualizarConta, excluirConta } = require('./controladores/contas');

const rotas = express();


rotas.get('/contas', listarContas);
rotas.post('/contas', cpfUnico, criarConta);
rotas.put('/contas/:numeroConta/usuario', atualizarConta);
rotas.delete('/contas/:numeroConta', excluirConta);
rotas.post('/transacoes/depositar', depositar);
rotas.post('/transacoes/sacar', sacar);
rotas.post('/transacoes/transferir', transferir);
rotas.get('/contas/saldo', verSaldo);
rotas.get('/contas/extrato', verExtrato);

module.exports = rotas;
