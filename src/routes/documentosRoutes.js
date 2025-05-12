const express = require('express');
const router = express.Router();
const documentosController = require('../controllers/documentoController');

router.use((req, res, next) => {
    console.log("Route handler is missing for:", req.path);
    next();
});

router.get("/", documentosController.listarDocumentos);
router.get("/listar-para-edicao/:id", documentosController.buscarDocumentoPorId);
router.post("/adicionar-Documento", documentosController.adicionarDocumento);
router.put("/modificar-Documento/:id", documentosController.atualizarDocumento);
router.delete("/excluir-Documento/:id", documentosController.deletarDocumento);

module.exports = router;