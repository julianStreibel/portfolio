const Sequelize = require("sequelize");

module.exports = sequelize.define("account", {
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
    },
    mail: {
        type: Sequelize.STRING(300),
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING(300),
        allowNull: false,
    }
}, { define: { freezeTableName: true } });