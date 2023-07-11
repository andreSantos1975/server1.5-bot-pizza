const express = require('express');
const router = express.Router();

 // Realize as operações necessárias com os dados recebidos do frontend para o assistente virtual 1
router.post('/postUser', (req, res) => {
  const { message } = req.body;

 

  // Exemplo de resposta para o frontend
  const responseData = {
    message: `Mensagem recebida pelo assistente virtual 1: ${message}`,
  };
  
  // Envie a resposta para o frontend
  res.json(responseData);
});

module.exports = router;
