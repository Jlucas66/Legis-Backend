const express = require("express");
const router = express.Router();   
const normasController = require("../controllers/normasController");


router.use((req, res, next) => {
    console.log("Route handler is missing for:", req.path);
    next();
});

router.get("/", normasController.listarNormas);
router.post("/", normasController.adicionarNorma);
router.put("/:numero", normasController.modificarNorma);
router.get("/:numero", normasController.buscarNormaPorNumero);
router.delete("/:numero", normasController.excluirNorma);

module.exports = router;