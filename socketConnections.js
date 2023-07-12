const axios = require('axios');


///const { findUserByEmail } = require('./banco/banco1');
///const banco1 = require('./banco/banco1');
const auth = require('./routes/auth_site');
const { email, senha } = req.body;
console.log('Email no socketConnections:', email);
console.log('Senha no socketConnections:', senha);

console.log('Testando soketConnection!!!');


function handleSocketConnection(io, user) {
    console.log('user:???', user)
  io.on('connection', (socket) => {
    socket.on(`postUser`, async (data) => {
        console.log('postUser event was called');
      const { message } = data;
      console.log('message???', message)
     /// const { email } = message; // Suponha que o email seja fornecido na mensagem do usuário

      try {
        // Chame a função findUserByEmail para autenticar o login do usuário
       /// const user = await banco1.findUserByEmail(email);
        ///console.log('user await findUserByEmail socketConnections.js', user);

        if (user) {
          // Usuário autenticado - continue com o atendimento no chatbot Rasa
          axios
          .post(`http://192.168.1.121:5005/webhooks/rest/webhook`, {
            sender: user,
            message: message,
          })
          .then((response) => {
            // Processar a resposta recebida do servidor Rasa
            const rasaResponse = response.data;
            console.log(`Resposta do servidor Rasa para o usuário ${user}:`, rasaResponse);

            // Enviar a resposta do Rasa de volta para o frontend
            socket.emit(`responseUser`, rasaResponse);
          })
          .catch((error) => {
            console.error(`Erro ao enviar a mensagem para o servidor Rasa para o usuário ${user}:`, error);
          });
        } else {
          // Usuário não autenticado - envie uma mensagem informando que o login falhou
          const errorMessage = 'Login falhou. Por favor, faça login corretamente.';
          const errorResponse = [{ text: errorMessage }];
          socket.emit(`responseUser`, errorResponse);
        }
      } catch (error) {
        console.error(`Erro ao autenticar o login do usuário ${user}:`, error);
      }
    });
  });
}

module.exports = handleSocketConnection;
