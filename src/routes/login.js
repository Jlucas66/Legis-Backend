const express = require('express');
const router = express.Router();

const usuarioValido = {
    email: 'Jlucas@policiacivil.pe.gov.br',
    password: '123456'
}

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (email === usuarioValido.email && password === usuarioValido.password) {
        console.log('Login bem-sucedido!');
        res.status(200).json({ 
            message: 'Login bem-sucedido!',
            data: usuarioValido.email
        });
    } else {
        res.status(401).json({ message: 'Usuário ou senha inválidos.' });
    }





})


module.exports = router