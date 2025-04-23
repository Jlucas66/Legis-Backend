//Aqui, irei iniciar o servidor para a aplicação.
const express = require('express');


const app = express();
const cors = require('cors');
const normaRoutes = require('./routes/normasRoutes');

app.use(cors());

app.use(express.json());
app.use('/api/normas', normaRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Normas API!');
});

const loginRoutes = require('./routes/login');
app.use('/api', loginRoutes);


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});