const Sequelize = require("sequelize");

module.exports = sequelize.define("stock", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING(300),
        allowNull: false,
        unique: true
    }
}, { define: { freezeTableName: true } });