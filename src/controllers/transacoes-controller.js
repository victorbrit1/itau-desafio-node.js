const TransacaoService = require("../service/transacao-service");

async function criarTransacao(req, res) {
    try {
        const { valor, data } = req.body;

        if (valor == null || data == null) {
            return res.status(400).json({
                message: "Valor e data são obrigatórios"
            });
        }

        if (typeof valor !== "number" || !Number.isFinite(valor)) {
            return res.status(422).json({
                message: "Valor deve ser um número válido"
            });
        }

        if (typeof data !== "string") {
            return res.status(422).json({
                message: "Data deve ser uma string"
            });
        }

        if (valor < 0) {
            return res.status(422).json({
                message: "Valor não pode ser negativo"
            });
        }

        // Validar formato ISO 8601 com fuso horário
        const formatoISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;

        if (!formatoISO.test(data)) {
            return res.status(422).json({
                message: "Data deve estar no formato ISO 8601"
            });
        }

        const dataHoraConverted = new Date(data);

        if (Number.isNaN(dataHoraConverted.getTime())) {
            return res.status(422).json({
                message: "Data inválida"
            });
        }

        if (dataHoraConverted > new Date()) {
            return res.status(422).json({
                message: "Data não pode estar no futuro"
            });
        }

        const id = await TransacaoService.criarTransacao(
            valor,
            dataHoraConverted
        );

        return res.status(201).json({
            message: "Transação criada com sucesso",
            id
        });

    } catch (error) {
        console.error("Erro ao criar transação:", error);

        return res.status(500).json({
            message: "Erro interno ao criar transação"
        });
    }
}

async function name(params) {
    
}

async function listarTransacoes(req, res) {
    try {
        const transacoes = await TransacaoService.listarTransacoes();

        return res.status(200).json(transacoes);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Erro ao listar transações"
        });
    }
}

async function buscarTransacaoPorId(req, res) {
    try {
        const { id } = req.params;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(422).json({
                message: "ID inválido"
            });
        }

        const transacao = await TransacaoService.buscarTransacaoPorId(id);

        if (!transacao) {
            return res.status(404).json({
                message: "Transação não encontrada"
            });
        }

        return res.status(200).json(transacao);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Erro ao buscar transação"
        });
    }
}

async function atualizarTransacao(req, res) {
    try {
        const { id } = req.params;
        const { valor, data } = req.body;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(422).json({
                message: "ID inválido"
            });
        }

        if (valor == null || data == null) {
            return res.status(400).json({
                message: "Valor e data são obrigatórios"
            });
        }

        if (
            typeof valor !== "number" ||
            !Number.isFinite(valor) ||
            valor < 0
        ) {
            return res.status(422).json({
                message: "Valor inválido"
            });
        }

        if (typeof data !== "string") {
            return res.status(422).json({
                message: "Data deve ser uma string"
            });
        }

        const formatoISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;

        if (!formatoISO.test(data)) {
            return res.status(422).json({
                message: "Data deve estar no formato ISO 8601"
            });
        }

        const dataConvertida = new Date(data);

        if (Number.isNaN(dataConvertida.getTime())) {
            return res.status(422).json({
                message: "Data inválida"
            });
        }

        if (dataConvertida > new Date()) {
            return res.status(422).json({
                message: "Data não pode estar no futuro"
            });
        }

        const linhasAfetadas = await TransacaoService.atualizarTransacao(
            id,
            valor,
            dataConvertida
        );

        if (linhasAfetadas === 0) {
            return res.status(404).json({
                message: "Transação não encontrada"
            });
        }

        return res.status(200).json({
            message: "Transação atualizada com sucesso"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Erro ao atualizar transação"
        });
    }
}

async function deletarTransacao(req, res) {
    try {
        const { id } = req.params;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(422).json({
                message: "ID inválido"
            });
        }

        const linhasAfetadas = await TransacaoService.deletarTransacao(id);

        if (linhasAfetadas === 0) {
            return res.status(404).json({
                message: "Transação não encontrada"
            });
        }

        return res.status(204).send();

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Erro ao deletar transação"
        });
    }
}

function healthCheck(req, res) {
    return res.status(200).json({
        status: "UP",
        message: "Api funcionando com Deploy automático"
    });
}


module.exports = {
    criarTransacao,
    listarTransacoes,
    buscarTransacaoPorId,
    atualizarTransacao,
    deletarTransacao,
    healthCheck
};