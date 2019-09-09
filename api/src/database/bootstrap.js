module.exports = async () => {

    // import models 
    const Stock = require("../models/Stock");
    const Point = require("../models/Point");
    const Account = require("../models/Account");

    // associations between models
    Stock.hasMany(Point, { as: "Point", foreignKey: "stockId" });
    Point.belongsTo(Stock, { as: "Stock", foreignKey: "stockId" });

    Account.hasMany(Stock, {as: "Stock", foreignKey: "userId"});
    Stock.belongsTo(Account, { as: "Account", foreignKey: "userId"});

    await sequelize.sync();

    const errHandler = (err) => {
        console.error("Error: ", err);
    }
}