const Sequelize = require("sequelize");

module.exports = sequelize.define("point", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    stockId: Sequelize.INTEGER(11),
    date: Sequelize.DATE,
    open: Sequelize.DOUBLE,
    high: Sequelize.DOUBLE,
    low: Sequelize.DOUBLE,
    close: Sequelize.DOUBLE,
    adjClose: Sequelize.DOUBLE,
    volume: Sequelize.DOUBLE,
}, { define: { freezeTableName: true } });