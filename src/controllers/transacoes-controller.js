const transacoes = require("../helpers/helpers")
const Transacao = require("../helpers/Transacao")
function CriarTransacao(req,res) {
    const {dataHora, valor} = req.body

    if(dataHora == null ||  valor == null) {
        return res.status(400).json({message : "Missing required info"})
    }

    try{
        
        const transacao = new Transacao(valor,dataHora)
        
        transacoes.push(transacao)
    
        return res.status(201).send()

    }catch(error){
        return res.status(422).json({message : error.message})
    }

}

module.exports = {CriarTransacao} 