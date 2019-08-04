const Sequelize = require("sequelize");
const config = require('../../config/config.json')["development"];

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: 'db',
        dialect: config.dialect,
        define: {
            //prevent sequelize from pluralizing table names
            freezeTableName: true
        }
    });

module.exports = sequelize;
global.sequelize = sequelize;