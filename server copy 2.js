const express = require('express');
const app = express();
const axios = require('axios');
const path = require('path');

// Importe a função findUserByEmail do arquivo auth_site.js
const { findUserByEmail } = require('./auth_site');

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

// Rotas
// Importe os arquivos de roteamento 
const assistant1Router = require('./routes/assistant1');

const authRouter = require('./routes/auth_site'); 

const formularioRoutes = require('./routes/formulario');

//Permite analisar o corpo das solicitações recebidas no formato JSON.
app.use(express.json());

//Aplicar esse middleware a todas as rotas do aplicativo, permitindo acesse e utilize os dados do formulário 
//enviados pelo cliente nas rotas que precisam lidar com formulários.
app.use(express.urlencoded({ extended: true }));
//Todas as rotas definidas no arquivo assistant1.js estarão disponíveis com esse prefixo. 
//Por exemplo, se houver uma rota definida como '/postUser' no arquivo assistant1.js, a rota completa seria '/assistant1/postUser'
app.use('/assistant1', assistant1Router);

app.use('/formulario', formularioRoutes);
// Todas as rotas definidas no arquivo auth_site.js estarão disponíveis diretamente no root do aplicativo
app.use('/', authRouter); 





// Rota para manipular a conexão de socket e receber mensagens do frontend
//MessageParser react-chatbot-kit
io.on('connection', (socket) => {
  socket.on('postUser', async (data) => {
    const { message } = data;
    const { email } = message; // Suponha que o email seja fornecido na mensagem do usuário

    try {
      // Chame a função findUserByEmail para autenticar o login do usuário
      const user = await findUserByEmail(email);

      if (user) {
        // Usuário autenticado - continue com o atendimento no chatbot Rasa
        axios.post('http://192.168.1.121:5005/webhooks/rest/webhook', {
          sender: 'user123',
          message: message,
        })
        .then((response) => {
          // Processar a resposta recebida do servidor Rasa
          const rasaResponse = response.data;
          console.log('Resposta do servidor Rasa:', rasaResponse);

          // Enviar a resposta do Rasa de volta para o frontend
          socket.emit('responseUser', rasaResponse);
        })
        .catch((error) => {
          console.error('Erro ao enviar a mensagem para o servidor Rasa:', error);
        });
      } else {
        // Usuário não autenticado - envie uma mensagem informando que o login falhou
        const errorMessage = 'Login falhou. Por favor, faça login corretamente.';
        const errorResponse = [{ text: errorMessage }];
        socket.emit('responseUser', errorResponse);
      }
    } catch (error) {
      console.error('Erro ao autenticar o login do usuário:', error);
    }
  });
});

// Verificar se a rota /enviar está sendo chamada
app.use('/enviar', (req, res, next) => {
  console.log('Rota /enviar foi chamada.'); // Log da rota sendo chamada
  next();
});

// Configurar o fallback para o roteamento
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});


httpServer.listen(5000, () => {
  console.log('Server started on port 5000');
});
