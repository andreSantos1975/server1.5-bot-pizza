const banco1 = require('../banco/banco1');

const express = require('express');
const router = express.Router();

// Recebe requisição do frontend diretório login arquivo Login.jsx
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Email no server:', email);

    try {
        // Verifique as credenciais no banco de dados diretório banco arquivo banco1.js
        const user = await banco1.findUserByEmail(email);
        console.log('user no arquivo auth_site.js:', user);
        if (user && user.password === password) {
            // Usuário válido, retorne uma resposta de sucesso para o frontend diretório login arquivo Login.jsx
            res.status(200).json({ message: 'Login bem-sucedido', user: { /* informações do usuário */ } });
        } else {
            // Usuário inválido, retorne uma resposta de erro para o frontend diretório login arquivo Login.jsx
            res.status(401).json({ message: 'senha ou email inválido' });
        }

    } catch (error) {
        console.error('Erro ao encontrar o usuário:', error);
        res.status(500).json({ message: 'Erro ao encontrar o usuário' });
    }
});

module.exports = router;
