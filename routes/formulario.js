const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Configurações de conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'clientes',
});

// Rota para lidar com o envio do formulário
router.post('/enviar', (req, res) => {
  const { nome, email, telefone, cidade, estado, nome_empresa, atividade_empresa } = req.body;

  // Executar uma consulta SQL para inserir os dados no banco de dados
  const query = `INSERT INTO formulario (nome, email, telefone, cidade, estado, nome_empresa, atividade_empresa) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  connection.query(query, [nome, email, telefone, cidade, estado, nome_empresa, atividade_empresa], (error, results) => {
    if (error) {
      console.error('Erro ao inserir os dados no banco de dados:', error);
      return res.status(500).json({ error: 'Ocorreu um erro ao processar a requisição.' });
    }

    // Dados inseridos com sucesso
    return res.status(200).json({ success: 'Dados enviados com sucesso.' });
  });
});

module.exports = router;
