const express = require("express");
const router = express.Router();   
const normasController = require("../controllers/normasController");


router.use((req, res, next) => {
    console.log("Route handler is missing for:", req.path);
    next();
});

router.get("/", normasController.listarNormas);
router.get("/admin", normasController.listarNormasAdmin);
router.get("/busca", normasController.buscarNormaPorNumero);
router.get("/listar-para-edicao/:id", normasController.listarNormaPorId);
router.post("/adicionar", normasController.adicionarNorma);
router.put("/modificar/:id", normasController.modificarNorma);
router.delete("/excluir/:id", normasController.excluirNorma);
router.delete("/modificar-status/:id", normasController.modificarStatusNorma)



module.exports = router;