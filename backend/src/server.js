//Aqui, irei iniciar o servidor para a aplicação.

const app = require('./app');
const PORT = 3000;

app.listen(PORT, () => {
    console.log('Servidor rodando em hhttp://localhost:', PORT);
});