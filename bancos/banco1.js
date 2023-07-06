const mysql = require('mysql2');

// Crie uma conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'clientes',
});

// Função para encontrar um usuário pelo email no banco de dados
function findUserByEmail(email) {
  return new Promise((resolve, reject) => {
    // Execute uma consulta SQL para encontrar o usuário com base no email
    const query = 'SELECT * FROM users WHERE email = ?';
    connection.query(query, [email], (error, results) => {
      if (error) {
        reject(error);
      } else {
        // Se um usuário for encontrado, retorne-o
        // Caso contrário, retorne null
        const user = results.length ? results[0] : null;
        console.log('Resultado da consulta no banco:', user);
        
        resolve(user);
      }
    });
  });
}


module.exports = {
  findUserByEmail,
};
