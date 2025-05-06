const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categoriasController');


router.use((req, res, next) => {
    console.log("Route handler is missing for:", req.path);
    next();
});


router.get("/", categoriasController.listarCategorias);
router.get("/listar-para-edicao/:id", categoriasController.buscarCategoriaPorId);
router.post("/adicionarOrgao", categoriasController.adicionarCategoria);
router.put("/modificar/:id", categoriasController.atualizarCategoria);
router.delete("/excluir/:id", categoriasController.excluirCategoria);

module.exports = router;