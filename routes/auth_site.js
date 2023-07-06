const banco1 = require('../banco/banco1');

const express = require('express');
const router = express.Router();

// Recebe requisição do Login.jsx frontend
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Email no server:', email);

    try {
        // Verifique as credenciais no banco de dados
        const user = await banco1.findUserByEmail(email);
        console.log('user no arquivo auth_site.js:', user);
        if (user && user.password === password) {
            // Usuário válido, retorne uma resposta de sucesso
            res.status(200).json({ message: 'Login bem-sucedido' });
        } else {
            // Usuário inválido, retorne uma resposta de erro
            res.status(401).json({ message: 'Credenciais inválidas' });
        }

    } catch (error) {
        console.error('Erro ao encontrar o usuário:', error);
        res.status(500).json({ message: 'Erro ao encontrar o usuário' });
    }
});

module.exports = router;
