//Aqui, irei iniciar o servidor para a aplicação.
try{
const app = require('./app');


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
} catch (error) {
    console.error("Erro ao iniciar o servidor:", error);
}