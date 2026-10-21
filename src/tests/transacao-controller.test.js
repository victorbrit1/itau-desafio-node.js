jest.mock("../service/transacao-service", () => ({
    criarTransacao: jest.fn(),
    listarTransacoes: jest.fn(),
    buscarTransacaoPorId: jest.fn(),
    atualizarTransacao: jest.fn(),
    deletarTransacao: jest.fn()
}));

const TransacaoController = require("../controllers/transacoes-controller");
const TransacaoService = require("../service/transacao-service");

function mockResponse() {
    const res = {};

    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);

    return res;
}

beforeEach(() => {
    jest.clearAllMocks();
});

describe("TransacaoController", () => {

    describe("criarTransacao", () => {

        test("Deve criar uma transação válida", async () => {
            const req = {
                body: {
                    valor: 150.75,
                    data: "2026-01-10T14:30:00Z"
                }
            };

            const res = mockResponse();

            TransacaoService.criarTransacao.mockResolvedValue(1);

            await TransacaoController.criarTransacao(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: "Transação criada com sucesso",
                id: 1
            });

            expect(TransacaoService.criarTransacao)
                .toHaveBeenCalledWith(
                    150.75,
                    new Date("2026-01-10T14:30:00Z")
                );
        });

        test("Deve retornar 400 quando faltar valor", async () => {
            const req = {
                body: {
                    data: "2026-01-10T14:30:00Z"
                }
            };

            const res = mockResponse();

            await TransacaoController.criarTransacao(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(TransacaoService.criarTransacao).not.toHaveBeenCalled();
        });

        test("Deve retornar 400 quando faltar data", async () => {
            const req = {
                body: {
                    valor: 100
                }
            };

            const res = mockResponse();

            await TransacaoController.criarTransacao(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(TransacaoService.criarTransacao).not.toHaveBeenCalled();
        });

        test("Deve retornar 422 para valor negativo", async () => {
            const req = {
                body: {
                    valor: -100,
                    data: "2026-01-10T14:30:00Z"
                }
            };

            const res = mockResponse();

            await TransacaoController.criarTransacao(req, res);

            expect(res.status).toHaveBeenCalledWith(422);
            expect(TransacaoService.criarTransacao).not.toHaveBeenCalled();
        });

        test("Deve retornar 422 quando valor for string", async () => {
            const req = {
                body: {
                    valor: "150",
                    data: "2026-01-10T14:30:00Z"
                }
            };

            const res = mockResponse();

            await TransacaoController.criarTransacao(req, res);

            expect(res.status).toHaveBeenCalledWith(422);
        });

        test("Deve retornar 422 para data inválida", async () => {
            const req = {
                body: {
                    valor: 100,
                    data: "data-invalida"
                }
            };

            const res = mockResponse();

            await TransacaoController.criarTransacao(req, res);

            expect(res.status).toHaveBeenCalledWith(422);
        });

        test("Deve retornar 422 para data futura", async () => {
            const req = {
                body: {
                    valor: 100,
                    data: "2099-01-10T14:30:00Z"
                }
            };

            const res = mockResponse();

            await TransacaoController.criarTransacao(req, res);

            expect(res.status).toHaveBeenCalledWith(422);
            expect(TransacaoService.criarTransacao).not.toHaveBeenCalled();
        });

        test("Deve retornar 500 quando o Service falhar", async () => {
            const req = {
                body: {
                    valor: 100,
                    data: "2026-01-10T14:30:00Z"
                }
            };

            const res = mockResponse();

            TransacaoService.criarTransacao.mockRejectedValue(
                new Error("Erro no banco")
            );

            const consoleSpy = jest.spyOn(console, "error")
                .mockImplementation(() => {});

            try {
                await TransacaoController.criarTransacao(req, res);

                expect(res.status).toHaveBeenCalledWith(500);
            } finally {
                consoleSpy.mockRestore();
            }
        });
    });

    describe("listarTransacoes", () => {

        test("Deve listar todas as transações", async () => {
            const req = {};
            const res = mockResponse();

            const transacoes = [
                { id: 1, valor: 100 },
                { id: 2, valor: 200 }
            ];

            TransacaoService.listarTransacoes.mockResolvedValue(transacoes);

            await TransacaoController.listarTransacoes(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(transacoes);
        });

        test("Deve retornar lista vazia quando não houver transações", async () => {
            const req = {};
            const res = mockResponse();

            TransacaoService.listarTransacoes.mockResolvedValue([]);

            await TransacaoController.listarTransacoes(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([]);
        });
    });

    describe("buscarTransacaoPorId", () => {

        test("Deve buscar uma transação existente", async () => {
            const req = {
                params: { id: "1" }
            };

            const res = mockResponse();

            const transacao = {
                id: 1,
                valor: 150,
                data: "2026-01-10T14:30:00Z"
            };

            TransacaoService.buscarTransacaoPorId.mockResolvedValue(transacao);

            await TransacaoController.buscarTransacaoPorId(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(transacao);
        });

        test("Deve retornar 404 quando transação não existir", async () => {
            const req = {
                params: { id: "999" }
            };

            const res = mockResponse();

            TransacaoService.buscarTransacaoPorId.mockResolvedValue(undefined);

            await TransacaoController.buscarTransacaoPorId(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        test("Deve retornar 422 para ID inválido", async () => {
            const req = {
                params: { id: "abc" }
            };

            const res = mockResponse();

            await TransacaoController.buscarTransacaoPorId(req, res);

            expect(res.status).toHaveBeenCalledWith(422);
            expect(TransacaoService.buscarTransacaoPorId)
                .not.toHaveBeenCalled();
        });
    });

    describe("atualizarTransacao", () => {

        test("Deve atualizar uma transação existente", async () => {
            const req = {
                params: { id: "1" },
                body: {
                    valor: 250,
                    data: "2026-01-10T14:30:00Z"
                }
            };

            const res = mockResponse();

            TransacaoService.atualizarTransacao.mockResolvedValue(1);

            await TransacaoController.atualizarTransacao(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(TransacaoService.atualizarTransacao)
                .toHaveBeenCalledWith(
                    "1",
                    250,
                    new Date("2026-01-10T14:30:00Z")
                );
        });

        test("Deve retornar 404 ao atualizar transação inexistente", async () => {
            const req = {
                params: { id: "999" },
                body: {
                    valor: 250,
                    data: "2026-01-10T14:30:00Z"
                }
            };

            const res = mockResponse();

            TransacaoService.atualizarTransacao.mockResolvedValue(0);

            await TransacaoController.atualizarTransacao(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        test("Deve retornar 422 ao atualizar com valor negativo", async () => {
            const req = {
                params: { id: "1" },
                body: {
                    valor: -50,
                    data: "2026-01-10T14:30:00Z"
                }
            };

            const res = mockResponse();

            await TransacaoController.atualizarTransacao(req, res);

            expect(res.status).toHaveBeenCalledWith(422);
            expect(TransacaoService.atualizarTransacao)
                .not.toHaveBeenCalled();
        });
    });

    describe("deletarTransacao", () => {

        test("Deve deletar uma transação existente", async () => {
            const req = {
                params: { id: "1" }
            };

            const res = mockResponse();

            TransacaoService.deletarTransacao.mockResolvedValue(1);

            await TransacaoController.deletarTransacao(req, res);

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        test("Deve retornar 404 ao deletar transação inexistente", async () => {
            const req = {
                params: { id: "999" }
            };

            const res = mockResponse();

            TransacaoService.deletarTransacao.mockResolvedValue(0);

            await TransacaoController.deletarTransacao(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        test("Deve retornar 422 ao deletar com ID inválido", async () => {
            const req = {
                params: { id: "abc" }
            };

            const res = mockResponse();

            await TransacaoController.deletarTransacao(req, res);

            expect(res.status).toHaveBeenCalledWith(422);
            expect(TransacaoService.deletarTransacao)
                .not.toHaveBeenCalled();
        });
    });
});