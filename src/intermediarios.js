const bancoDados = require('./bancodedados');


const cpfUnico = (req, res, next) => {
    const cpfUsuario = Number(req.body.cpf);

    if (isNaN(cpfUsuario)) {
        return res.status(400).json({ mensagem: 'O cpf informado não é válido' })
    }

    const verificacpf = bancoDados.contas.find(usuario => usuario.cpf === cpfUsuario);

    if (verificacpf) {
        return res.status(400).json({ mensagem: 'O cpf informado já é cadastrado' })
    }

    next();
}


module.exports = {
    cpfUnico
}
