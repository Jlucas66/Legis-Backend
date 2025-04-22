//Aqui, irei iniciar o servidor para a aplicação.
const express = require('express');


const app = express();
const cors = require('cors');
const normaRoutes = require('./routes/normaRoutes');

app.use(express.json());
app.use('/api/normas', normaRoutes);


const PORT = 3000;
app.listen(PORT, () => {
    console.log('Servidor rodando em hhttp://localhost:', PORT);
});