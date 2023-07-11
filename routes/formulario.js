const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

console.log('Arquivo formulario.js foi chamado.');



// Configurações de conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'clientes',
});

// Rota para lidar com o envio do formulário
router.post('/enviar', (req, res) => {
    console.log('Rota /enviar foi chamada.'); // Log da rota sendo chamada
  const { nome, email, senha, confirmarSenha, telefone, cidade, estado, empresa, atividade } = req.body;

  // Executar uma consulta SQL para inserir os dados no banco de dados
  const query = `INSERT INTO users (nome, email, senha, confirmar_senha, telefone, cidade, estado, empresa, atividade) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  connection.query(query, [nome, email, senha, confirmarSenha, telefone, cidade, estado, empresa, atividade], (error, results) => {
    if (error) {
      console.error('Erro ao inserir os dados no banco de dados:', error);
      return res.status(500).json({ error: 'Ocorreu um erro ao processar a requisição.' });
    }

    // Dados inseridos com sucesso
    return res.status(200).json({ success: 'Dados enviados com sucesso.' });
  });
});

module.exports = router;
