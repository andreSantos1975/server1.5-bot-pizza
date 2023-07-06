const express = require('express');
const app = express();
const axios = require('axios');
const path = require('path');

const cors = require('cors');
app.use(cors());

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
const banco1 = require('./bancos/banco1');

app.use(express.json());

// Adicione a rota do arquivo assistant1.js
app.use('/assistant1', assistant1Router);



//Recebe requisição do Login.jsx frontend
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Email e password no server:', email);

  // Verifique as credenciais no banco de dados
  const user = banco1.findUserByEmail(email);
  if (user && user.password === password) {
    // Usuário válido, retorne uma resposta de sucesso
    res.status(200).json({ message: 'Login bem-sucedido' });
  } else {
    // Usuário inválido, retorne uma resposta de erro
    res.status(401).json({ message: 'Credenciais inválidas' });
  }
});









// Rota para manipular a conexão de socket e receber mensagens do frontend
//MessageParser react-chatbot-kit
io.on('connection', (socket) => {
  // Evento 'postUser' para receber mensage do frontend MessageParse.jsx /diretório react-chatbot-kit
  socket.on('postUser', (data) => {
    const { message } = data; 

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
        //  Processar a resposta recebida do servidor Rasa
        const rasaResponse = response.data;
        console.log('Resposta do servidor Rasa:', rasaResponse);

        // Enviar a resposta do Rasa de volta para o frontend
        socket.emit('responseUser', rasaResponse);
      })
      .catch((error) => {
        console.error('Erro ao enviar a mensagem para o servidor Rasa:', error);
      });

  });
});

// Configurar o fallback para o roteamento
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
 res.sendFile(path.join(__dirname, 'client/build/index.html'));
});


httpServer.listen(5000, () => {
  console.log('Server started on port 5000');
});
