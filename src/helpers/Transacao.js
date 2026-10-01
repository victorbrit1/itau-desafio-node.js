class Transacao {
    constructor(valor,dataHora){

        if(typeof dataHora !== "string" || typeof valor !== "number"){
            throw new TypeError("Type error") 
        }

        const dataHoraConverted = new Date(dataHora)

        if(isNaN(dataHoraConverted.getTime())){
            throw new TypeError("dataHora invalid")
        }

        if(dataHoraConverted > new Date()){
            throw new TypeError("data in the future")
        }

        if(valor < 0 ){
            throw new TypeError("valor invalid")
        }
        
        this.valor = valor
        this.dataHora = dataHoraConverted
    }
}

module.exports = Transacao