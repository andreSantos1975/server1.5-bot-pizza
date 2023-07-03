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
//const assistant2Routes = require('./routes/assistant2');
// importe outras rotas para assistentes virtuais adicionais

// Middleware para usar as rotas
app.use('/assistant1', assistant1Routes);
//app.use('/assistant2', assistant2Routes);



httpServer.listen(5000, () => {
  console.log('Server started on port 5000');
});