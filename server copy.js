const express = require('express');
const app = express();
const axios = require('axios');

const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
});

// Importe o arquivo assistant1.js
const assistant1Router = require('./routes/assistant1');

app.use(express.json());

// Adicione a rota do arquivo assistant1.js
app.use('/assistant1', assistant1Router);

// Rota para manipular a conexão de socket e receber mensagens do frontend
io.on('connection', (socket) => {
  // Evento 'postUser' para receber mensagens do frontend
  socket.on('postUser', (data) => {
    const { message } = data; // Obtém a mensagem enviada pelo frontend

    // Aqui você pode realizar as operações necessárias com os dados recebidos do frontend

    // Exemplo de resposta para o frontend
    const responseData = {
      message: `Mensagem recebida: ${message}`,
    };

    // Enviar a mensagem para o servidor Rasa usando uma solicitação HTTP
    axios
      .post('http://192.168.1.121:5005/webhooks/rest/webhook', {
        sender: "user123",
        message: message,
      })
      .then((response) => {
        // Aqui você pode processar a resposta recebida do servidor Rasa
        const rasaResponse = response.data;
        console.log('Resposta do servidor Rasa:', rasaResponse);

        // Enviar a resposta do Rasa de volta para o frontend
        socket.emit('responseUser', rasaResponse);
      })
      .catch((error) => {
        console.error('Erro ao enviar a mensagem para o servidor Rasa:', error);
      });

    //console.log('Resposta para o frontend:', responseData);
  });
});

httpServer.listen(5000, () => {
  console.log('Server started on port 5000');
});
