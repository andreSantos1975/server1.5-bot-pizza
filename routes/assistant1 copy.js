// routes/assistant1.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

//Requisição do MessageParse.jsx do diretório react-chatbot-kit
router.post('/postUser', (req, res) => {
    console.log('Requisição recebida em assistant1.js:', req.body);
  const { message } = req.body;

  

  // Realize as operações necessárias com os dados recebidos do frontend para o assistente virtual 1

  // Exemplo de resposta para o frontend
  const responseData = {
    message: `Mensagem recebida pelo assistente virtual 1: ${message}`,
  };

  // Enviar a mensagem para o servidor Rasa do assistente virtual 1
  axios
    .post('http://192.168.1.121:5005/webhooks/rest/webhook', {
      sender: "user123",
      message: message,
    })
    .then((response) => {
      // Aqui você pode processar a resposta recebida do servidor Rasa para o assistente virtual 1
      const rasaResponse = response.data;
      console.log('Resposta do servidor Rasa para o assistente virtual 1:', rasaResponse);

      // Enviar a resposta do Rasa para o frontend
      res.json(rasaResponse);
    })
    .catch((error) => {
      console.error('Erro ao enviar a mensagem para o servidor Rasa do assistente virtual 1:', error);
      res.status(500).json({ error: 'Erro ao enviar a mensagem para o servidor Rasa do assistente virtual 1' });
    });

  // console.log('Resposta para o frontend do assistente virtual 1:', responseData);
});

module.exports = router;
