const db = require("../db/db");

async function listarTransacoes() {
    const [rows] = await db.query("SELECT * FROM transacao");
    return rows;
}

async function buscarTransacaoPorId(id) {
    const [rows] = await db.query(
        "SELECT * FROM transacao WHERE id = ?",
        [id]
    );

    return rows[0];
}

async function criarTransacao(valor, data) {
    const [result] = await db.query(
        "INSERT INTO transacao (valor, data) VALUES (?, ?)",
        [valor, data]
    );

    return result.insertId;
}

async function atualizarTransacao(id, valor, data) {
    const [result] = await db.query(
        "UPDATE transacao SET valor = ?, data = ? WHERE id = ?",
        [valor, data, id]
    );

    return result.affectedRows;
}

async function deletarTransacao(id) {
    const [result] = await db.query(
        "DELETE FROM transacao WHERE id = ?",
        [id]
    );

    return result.affectedRows;
}

module.exports = {
    listarTransacoes,
    buscarTransacaoPorId,
    criarTransacao,
    atualizarTransacao,
    deletarTransacao
};