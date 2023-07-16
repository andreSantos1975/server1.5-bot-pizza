const axios = require('axios');
const { findUserByEmail } = require('./banco/banco1.js');


console.log('Testando socketConnection!!!'); //Testando com ...log

function handleSocketConnection(io, user) {
  console.log('user:???', user); //Testando user com .log
  io.on('connection', (socket) => {
    //postUser requisição do componente MessageParser.jsx diretório react-chatbot-kit
    socket.on(`postUser`, async (data) => {
      console.log('postUser event was called');// Console .....log
      const { message, logado } = data;

      console.log('socketConnections message???', message);
      console.log('socketConnections logado???', logado);
      ///const { email } = message; // Suponha que o email seja fornecido na mensagem do usuário

      try {
        // Chame a função findUserByEmail para autenticar o login do usuário
        ///const user = await findUserByEmail(email);
        console.log('user no socetConnection', user);// Console .....log

        if (user) {
          // Usuário autenticado - continue com o atendimento no chatbot Rasa
          axios
            .post(`http://192.168.1.121:5005/webhooks/rest/webhook`, {
              sender: user,
              message: message,
              logado: logado,
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
