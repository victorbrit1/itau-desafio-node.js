const express = require("express")
const router = express.Router()
const controller = require("../controllers/transacoes-controller")

router.post("/transacoes",controller.CriarTransacao)




module.exports = router