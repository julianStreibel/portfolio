module.exports = async () => {

    // import models 
    const Stock = require("../models/Stock");
    const Point = require("../models/Point");

    // associations between models
    Stock.hasMany(Point, { as: "Point", foreignKey: "stockId" });
    Point.belongsTo(Stock, { as: "Stock", foreignKey: "stockId" });

    await sequelize.sync();

    const errHandler = (err) => {
        console.error("Error: ", err);
    }
}