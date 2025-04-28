const express = require("express");
const router = express.Router();   
const normasController = require("../controllers/normasController");


router.use((req, res, next) => {
    console.log("Route handler is missing for:", req.path);
    next();
});

router.get("/", normasController.listarNormas);
router.get("/admin", normasController.listarNormasAdmin);
router.post("/adicionar", normasController.adicionarNorma);
router.put("/modificar", normasController.modificarNorma);
router.get("/busca", normasController.buscarNormaPorNumero);
router.delete("/excluir/:id", normasController.excluirNorma);



module.exports = router;