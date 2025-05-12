//vai iniciar a aplicação, importando o express e o cors
//vai criar uma instância do express e configurar o cors
//vai importar as rotas e usar o middleware para as rotas
//vai exportar a instância do express para ser usada em outros arquivos.

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());   

const normasRoutes = require('./routes/normasRoutes.js');
app.use("/Normas", normasRoutes);

const categoriasRoutes = require('./routes/categoriasRoutes.js');
app.use("/Categorias", categoriasRoutes);

const documentosRoutes = require('./routes/documentosRoutes.js');
app.use("/Documentos", documentosRoutes);

module.exports = app;