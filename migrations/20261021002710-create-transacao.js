"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("transacao", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },

            valor: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },

            data: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("transacao");
    }
};