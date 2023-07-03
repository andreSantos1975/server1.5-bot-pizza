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

const assistant1Routes = require('./routes/assistant1');

// Middleware para usar as rotas do assistente virtual 1
app.use('/assistant1', assistant1Routes);

io.on('connection', (socket) => {
  // Lógica do Socket.IO
  socket.on('postUser', (data) => {
    // Aqui você pode acessar os dados enviados pelo frontend
    const { message } = data;

    // Realize as operações necessárias com os dados recebidos do frontend

    // Exemplo de resposta para o frontend
    const responseData = {
      message: `Mensagem recebida: ${message}`,
    };



   // console.log('Resposta para o frontend:', responseData);
  });
});

httpServer.listen(5000, () => {
  console.log('Server started on port 5000');
});
