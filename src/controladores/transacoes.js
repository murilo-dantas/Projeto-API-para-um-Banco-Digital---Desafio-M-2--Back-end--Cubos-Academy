const bancoDados = require('../bancodedados');
const { format } = require('date-fns');


const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;


    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'É obrigatório inserir a conta.' });
    }

    if (!valor) {
        return res.status(400).json({ mensagem: 'É obrigatório inserir o valor.' });
    }

    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'O valor precisa ser maior que zero.' });
    }

    const contaUsuario = bancoDados.contas.find(usuario => Number(usuario.numero) === Number(numero_conta));

    if (!contaUsuario) {
        return res.status(404).json({ mensagem: 'Conta não encontrada.' });
    }

    const registro = {
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta,
        valor
    }

    bancoDados.depositos.push(registro);


    contaUsuario.saldo = + valor;

    return res.status(200).send();

}


const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'É obrigatório inserir a conta.' });
    }

    if (!valor) {
        return res.status(400).json({ mensagem: 'É obrigatório inserir o valor.' });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'É obrigatório inserir a senha.' });
    }

    if (isNaN(numero_conta)) {
        return res.status(400).json({ mensagem: 'A conta informada não é válida.' });
    }

    if (isNaN(valor)) {
        return res.status(400).json({ mensagem: 'O valor informado não é válido.' });
    }

    const indexConta = bancoDados.contas.findIndex(usuario => Number(usuario.numero) === Number(numero_conta));

    if (indexConta < 0) {
        return res.status(404).json({ mensagem: 'Conta não encontrada.' });
    }

    if (bancoDados.contas[indexConta].usuario.senha != senha) {
        return res.status(404).json({ mensagem: 'A senha não é válida!' });
    }

    if (bancoDados.contas[indexConta].saldo < valor) {
        return res.status(404).json({ mensagem: 'Saldo insuficiente!' });
    }

    bancoDados.contas[indexConta].saldo = bancoDados.contas[indexConta].saldo - valor;

    bancoDados.saques.push({
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta,
        valor
    });

    return res.status(200).send();
}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem) {
        return res.status(400).json({ mensagem: 'É obrigatório inserir a conta de origem.' });
    }

    if (!numero_conta_destino) {
        return res.status(400).json({ mensagem: 'É obrigatório inserir a conta de destino.' });
    }

    if (!valor) {
        return res.status(400).json({ mensagem: 'É obrigatório inserir o valor.' });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'É obrigatório inserir a senha.' });
    }


    const indexContaOrigem = bancoDados.contas.findIndex(usuario => Number(usuario.numero) === Number(numero_conta_origem));

    if (indexContaOrigem < 0) {
        return res.status(404).json({ mensagem: 'Conta não encontrada.' });
    }

    const indexContaDestino = bancoDados.contas.findIndex(usuario => Number(usuario.numero === Number(numero_conta_destino)));

    if (indexContaDestino < 0) {
        return res.status(404).json({ mensagem: 'Conta não encontrada.' });
    }

    if (bancoDados.contas[indexContaOrigem].usuario.senha != senha) {
        return res.status(400).json({ mensagem: 'A senha não é válida!' });
    }

    if (bancoDados.contas[indexContaOrigem].saldo < valor) {
        return res.status(404).json({ mensagem: 'Saldo insuficiente!' });
    }

    bancoDados.contas[indexContaOrigem].saldo = bancoDados.contas[indexContaOrigem].saldo - Number(valor);

    bancoDados.contas[indexContaDestino].saldo = bancoDados.contas[indexContaDestino].saldo + Number(valor);

    bancoDados.transferencias.push({
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta_origem,
        numero_conta_destino,
        valor
    });

    return res.status(200).send();

}


const verSaldo = (req, res) => {
    const { numero_conta, senha } = req.body;

    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'É obrigatório inserir o número da conta.' });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'É obrigatório inserir a senha.' });
    }

    const indexConta = bancoDados.contas.findIndex(usuario => usuario.numero === numero_conta);

    if (indexConta < 0) {
        return res.status(404).json({ mensagem: 'Conta não encontrada.' });
    }

    if (bancoDados.contas[indexConta].usuario.senha != senha) {
        return res.status(404).json({ mensagem: 'Senha inválida!' });
    }


    return res.json({ mensagem: `Saldo: ${bancoDados.contas[indexConta].saldo}` });

}


const verExtrato = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'É obrigatório inserir o número da conta.' });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'É obrigatório inserir a senha.' });
    }

    const contaUsuario = bancoDados.contas.find(usuario => Number(usuario.numero) === Number(numero_conta));

    if (!contaUsuario) {
        return res.status(404).json({ mensagem: 'Conta não encontrada.' });
    }

    if (contaUsuario.usuario.senha != senha) {
        return res.status(404).json({ mensagem: 'Senha inválida!' });
    }

    const filtroSaques = bancoDados.saques.filter((saque) => Number(saque.numero_conta) === Number(numero_conta));

    const filtroDepositos = bancoDados.depositos.filter((deposito) => Number(deposito.numero_conta) === Number(numero_conta));

    const filtroTranferenciasOrigem = bancoDados.transferencias.filter((transferencia) => Number(transferencia.numero_conta_origem) === Number(numero_conta));

    const filtroTranferenciasDestino = bancoDados.transferencias.filter((transferencia) => Number(transferencia.numero_conta_destino) === Number(numero_conta));

    return res.json({
        depositos: filtroDepositos,
        saques: filtroSaques,
        trasnferenciasEnviadas: filtroTranferenciasOrigem,
        transferenciasRecebidas: filtroTranferenciasDestino
    })

}


module.exports = {
    depositar,
    sacar,
    transferir,
    verSaldo,
    verExtrato
}
