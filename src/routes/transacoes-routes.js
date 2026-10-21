const express = require("express")
const router = express.Router()
const controller = require("../controllers/transacoes-controller")

router.post("/transacoes",controller.criarTransacao)
router.get("/transacoes",controller.listarTransacoes)
router.get("/transacoes/:id",controller.buscarTransacaoPorId)
router.delete("/transacoes/:id",controller.deletarTransacao)
router.put("/transacoes/:id",controller.atualizarTransacao)




module.exports = router