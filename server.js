const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
});

const axios = require('axios');

io.on('connection', (socket) => {
  socket.on('postUser', (data) => {
    // Aqui você pode acessar os dados enviados pelo frontend
    const { message } = data;

    // Realize as operações necessárias com os dados recebidos do frontend

    // Exemplo de resposta para o frontend
    const responseData = {
      message: `Mensagem recebida: ${message}`,
    };

    console.log('message vinda do MessageParser:', message)
    // Enviar a mensagem para o servidor Rasa
    axios.post('http://192.168.1.121:5005/webhooks/rest/webhook', {
      sender: "user123",
      message: message,
    })
    .then((response) => {
      // Aqui você pode processar a resposta recebida do servidor Rasa
      const rasaResponse = response.data;
      console.log('Resposta do servidor Rasa:', rasaResponse);

      // Enviar a resposta do Rasa para o frontend
      socket.emit('responseUser', rasaResponse);
    })
    .catch((error) => {
      console.error('Erro ao enviar a mensagem para o servidor Rasa:', error);
    });

   // console.log('Resposta para o frontend:', responseData);
  });
});

httpServer.listen(5000, () => {
  console.log('Server started on port 5000');
});