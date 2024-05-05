const bancoDados = require('../bancodedados');

let idProximaContaCriada = 1


const listarContas = (req, res) => {
    const { senha_banco } = req.query;

    if (!senha_banco) {
        return res.status(400).json({ mensagem: 'A senha deve ser informada.' });
    }

    if (senha_banco != bancoDados.banco.senha) {
        return res.status(400).json({ mensagem: 'A senha do banco é inválida' });
    }


    return res.json(bancoDados.contas);
}


const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome) {
        return res.status(400).json({ mensagem: 'O nome deve ser informado.' });
    }

    if (!cpf) {
        return res.status(400).json({ mensagem: 'O cpf deve ser informado.' });
    }

    if (!data_nascimento) {
        return res.status(400).json({ mensagem: 'A data de nascimento deve ser informada.' });
    }

    if (!telefone) {
        return res.status(400).json({ mensagem: 'O telefone deve ser informado.' });
    }

    if (!email) {
        return res.status(400).json({ mensagem: 'O email deve ser informado.' });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'A senha deve ser informada.' });
    }

    const contaCadastrada = bancoDados.contas.find(conta => {
        return conta.usuario.cpf === cpf || conta.usuario.email === email
    });

    if (contaCadastrada) {
        return res.status(400).json({ mensagem: 'Cpf ou email já existente.' });
    }

    const novaConta = {
        numero: idProximaContaCriada,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    }

    bancoDados.contas.push(novaConta);

    idProximaContaCriada++;

    res.status(201).send();
}


const atualizarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const { numeroConta } = req.params;


    if (!nome) {
        return res.status(400).json({ mensagem: 'O nome deve ser informado.' });
    }

    if (!cpf) {
        return res.status(400).json({ mensagem: 'O cpf deve ser informado.' });
    }

    if (!data_nascimento) {
        return res.status(400).json({ mensagem: 'A data de nascimento deve ser informada.' });
    }

    if (!telefone) {
        return res.status(400).json({ mensagem: 'O telefone deve ser informado.' });
    }

    if (!email) {
        return res.status(400).json({ mensagem: 'O email deve ser informado.' });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'A senha deve ser informada.' });
    }

    const contaUsuario = bancoDados.contas.find(conta => Number(conta.numero) === Number(numeroConta));

    if (!contaUsuario) {
        return res.status(404).json({ mensagem: 'Conta não encontrada.' });
    }

    if (cpf != contaUsuario.usuario.cpf) {
        const verificaCpf = bancoDados.contas.find(conta => conta.usuario.cpf === cpf);

        if (verificaCpf) {
            return res.status(404).json({ mensagem: 'Cpf cadastrado já existe!' });
        }
    };

    if (email != contaUsuario.usuario.email) {
        const verificaEmail = bancoDados.contas.find(conta => conta.usuario.email === email);

        if (verificaEmail) {
            return res.status(404).json({ mensagem: 'Email cadastrado já existe!' });
        }
    };


    contaUsuario.usuario = {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha
    }

    res.status(204).send();

}


const excluirConta = (req, res) => {
    const { numeroConta } = req.params;

    const contaUsuario = bancoDados.contas.find(conta => Number(conta.numero) === Number(numeroConta));

    if (!contaUsuario) {
        return res.status(404).json({ mensagem: 'Email cadastrado já existe!' });
    }

    if (contaUsuario.saldo > 0) {
        return res.status(403).json({ mensagem: 'A conta só pode ser excluida se o saldo for igual a zero!' });
    }

    bancoDados.contas = bancoDados.contas.filter(conta => Number(conta.numero) != Number(numeroConta));

    return res.status(204).send();

}


module.exports = {
    listarContas,
    criarConta,
    atualizarConta,
    excluirConta
}
