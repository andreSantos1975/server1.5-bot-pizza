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

// Rotas
// Importe os arquivos de roteamento 
const assistant1Router = require('./routes/assistant1');

//Login autenticação 
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
  // Evento 'postUser' para receber mensage do frontend MessageParse.jsx /diretório react-chatbot-kit
  socket.on('postUser', (data) => {
    const { message } = data;
     console.log('message???', message)
    // Exemplo de resposta para o frontend
    const responseData = {
      message: `Mensagem recebida: ${message}`,
    };

    // Enviar a mensagem para o servidor Rasa usando uma solicitação HTTP
    axios.post('http://192.168.1.121:5005/webhooks/rest/webhook', {
        sender: "userpizza",
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
