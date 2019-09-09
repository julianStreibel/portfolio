const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const csv = require('csv-parser');
const Sequelize = require("sequelize");
const math = require("mathjs");
const Op = Sequelize.Op;
var cov = require('compute-covariance');


// models
const Stock = require('../models/Stock');
const Point = require('../models/Point');

// /api/v1/stocks/...
const router = express.Router();

// log
router.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

const requiresLogin = (req, res, next) => {
    console.log("session", req.session)
    if (req.session && req.session.userId) {
        return next();
    } else {
        var err = new Error('You must be logged in to view this page.');
        err.status = 401;
        return next(err);
    }
}

// list all stocks with the substring in query
router.get('/find/:query', requiresLogin, async (req, res) => {
    const stocks = await Stock.findAll({
        where: {
            [Op.and]: [{ name: { [Op.substring]: req.params.query } }, { userId: req.session.userId }]

        }
    }).catch(errHandler)
    res.json(stocks);
});

// returns the stock with the name with all his points in the year-frame
router.get('/:name/:startYear/:stopYear', requiresLogin, async (req, res) => {
    const startYear = req.params.startYear ? req.params.startYear : 0;
    const stopYear = req.params.stopYear ? req.params.stopYear : 0;
    const stock = await Stock.findOne({
        where: {
            [Op.and]: [{ name: req.params.name }, { userId: req.session.userId }]
        },
        include: [{
            model: Point, as: "Point", where: {
                date: {
                    [Op.lt]: new Date(stopYear, 1),
                    [Op.gt]: new Date(startYear, 1)
                }
            }
        }]
    }).catch(errHandler);
    res.json(stock);
})

// returns the stock with the name with all his points
router.get('/:name', requiresLogin, async (req, res) => {
    const stock = await Stock.findOne({
        where: { [Op.and]: [{ name: req.params.name }, { userId: req.session.userId }] }, include: [{
            model: Point, as: "Point"
        }]
    }).catch(errHandler);
    res.json(stock);
})

// returns the stock with the name with all his points
router.get('/:name/:startYear/:stopYear/statistics', requiresLogin, async (req, res) => {
    const startYear = req.params.startYear ? req.params.startYear : 0;
    const stopYear = req.params.stopYear ? req.params.stopYear : 0;
    const stock = await Stock.findOne({
        where: { [Op.and]: [{ name: req.params.name }, { userId: req.session.userId }] }, include: [{
            model: Point, as: "Point", where: {
                date: {
                    [Op.lt]: new Date(stopYear, 1),
                    [Op.gt]: new Date(startYear, 1)
                }
            }
        }]
    }).catch(errHandler);
    if (!stock || stock === null) {
        res.json(null);
    }
    // calculate change from open in stock
    let change = calculateChange(stock.Point);

    const oneYear = stock.Point.length > 250 ? stock.Point[stock.Point.length - 1].open / stock.Point[stock.Point.length - 250].open - 1 : null;
    const fiveYears = stock.Point.length > 1250 ? stock.Point[stock.Point.length - 1].open / stock.Point[stock.Point.length - 1250].open - 1 : null;
    const tenYears = stock.Point.length > 2500 ? stock.Point[stock.Point.length - 1].open / stock.Point[stock.Point.length - 2500].open - 1 : null;

    const stats = {
        std: math.std(change),
        ev: math.mean(change),
        min: math.min(change),
        max: math.max(change),
        oneYear,
        fiveYears,
        tenYears,
    };
    res.json([stats, stock]);
})

// lists all stocks without points
router.get('/', requiresLogin, async (req, res) => {
    const stocks = await Stock.findAll({ where: { userId: req.session.userId } }).catch(errHandler);
    res.json(stocks);
});

// creates new stock
router.post('/', requiresLogin, upload.single('csv'), async (req, res) => {
    if (req.body.name) {
        const stock = await Stock.create({
            name: req.body.name,
            userId: req.session.userId
        }).catch(errHandler);
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', async (row) => await Point.create({
                stockId: stock.id,
                date: row.Date,
                open: Number(row.Open),
                high: Number(row.High),
                low: Number(row.Low),
                close: Number(row.Close),
                adjClose: Number(row['Adj Close']),
                volume: Number(row.Volume),
            })).catch(errHandler);
    }
});

// creates and returns an optimal allocation
router.post('/allocation', requiresLogin, multer().none(), async (req, res) => {
    const startYear = req.body.start;
    const stopYear = req.body.stop;
    let stocks = req.body.stocks.split(",");
    const strategy = req.body.strategy;
    stocks = await Promise.all(stocks.map(async s => {
        return await Stock.findOne({
            where: { [Op.and]: [{ name: s }, { userId: req.session.userId }] }, include: [{
                model: Point, as: "Point", where: {
                    date: {
                        [Op.lt]: new Date(stopYear, 1),
                        [Op.gt]: new Date(startYear, 1)
                    }
                }
            }]
        }).catch(errHandler);
    })).catch(errHandler);
    stocks.map(s => { if (!s) res.json(null) })

    // same time per point and same length
    const startDate = stocks.map(s => s.Point).map(s => s[0].date).sort((a, b) => b - a)[0];
    const stopDate = stocks.map(s => s.Point).map(s => s[s.length - 1].date).sort((a, b) => a - b)[0];
    stocks = stocks.map(stock => stock.Point.filter(p => p.date >= startDate && p.date <= stopDate));
    // absolute same length
    const maxLength = stocks.map(stock => stock.length).sort((a, b) => a - b)[0];
    stocks = stocks.map(stock => {
        if (stock.length > maxLength) {
            return stock.slice(0, maxLength);
        }
        return stock;
    })
    let saveStocksforLater = stocks;
    const totalReturns = stocks.map(s => s[s.length - 1].open / s[0].open - 1);
    // calculate change in all stocks
    stocks = stocks.map(s => calculateChange(s));
    let estimatetReturns = stocks.map(ret => math.mean(ret));
    // calculate cov matrix
    let t = stocks.map((outerStock) => {
        return stocks.map((innerStock) => {
            return cov(outerStock, innerStock)[0][1];
        })
    })
    let covariance = t;

    t = math.multiply(t, 2);

    let helper = [];
    let helper2 = [];
    let weights = [];
    if (strategy === 'Bulletproof (min Risk)') {
        // framing with 1 and 0 in the corner
        t = t.map(line => {
            let copy = line;
            copy.push(1);
            helper.push(1);
            helper2.push(0);
            return copy;
        })
        helper.push(0);
        helper2.push(1);
        t.push(helper);
        t = math.multiply(t, 10000000)
        t = math.round(t)
        t = math.multiply(t, 0.0000001)
        weights = math.multiply(math.inv(t), helper2);
        weights = weights.slice(0, weights.length - 1)

    } else if (strategy === 'Efficient (opt Risk Return)') {
        let helper3 = estimatetReturns;
        t = t.map((line, i) => {
            let copy = line;
            copy.push(estimatetReturns[i])
            copy.push(1);
            helper.push(1);
            helper2.push(0);
            return copy;
        })
        helper.push(0);
        helper.push(0);
        helper3.push(0);
        helper3.push(0);
        helper2.push(Number(req.body.wantedReturn));
        helper2.push(1);
        t.push(helper3)
        t.push(helper);
        t = math.multiply(t, 10000000)
        t = math.round(t)
        t = math.multiply(t, 0.0000001)
        weights = math.multiply(math.inv(t), helper2);
        weights = weights.slice(0, weights.length - 2)
        estimatetReturns = estimatetReturns.slice(0, estimatetReturns.length - 2)
    }



    let allocation = {};
    req.body.stocks.split(",").map((stock, i) => allocation[stock] = weights[i]);
    let ev = math.multiply(math.transpose(weights), estimatetReturns);
    const totalReturn = math.multiply(math.transpose(weights), totalReturns);
    let variance = math.multiply(math.transpose(weights), covariance);
    variance = math.multiply(variance, weights);

    const name = Math.random();
    const points = calculatePortfolioPoints(allocation, saveStocksforLater);

    // Portfolio as stock for statistic analysis
    const portfolioAsStock = await Stock.create({ name }).catch(errHandler);
    points.map(async p => await Point.create({ ...p, stockId: portfolioAsStock.id }).catch(errHandler))
    const change = calculateChange(points);


    const oneYear = points.length > 250 ? points[points.length - 1].open / points[points.length - 250].open - 1 : null;
    const fiveYears = points.length > 1250 ? points[points.length - 1].open / points[points.length - 1250].open - 1 : null;
    const tenYears = points.length > 2500 ? points[points.length - 1].open / points[points.length - 2500].open - 1 : null;

    res.json({
        name,
        allocation: allocation,
        ev,
        std: math.sqrt(variance),
        start: startDate,
        stop: stopDate,
        totalReturn,
        Point: points,
        min: math.min(change),
        max: math.max(change),
        oneYear,
        fiveYears,
        tenYears,
    });
})

// allocation = {"Stock1": 0.5, "Stock2": 0.5}; 
// stockPointList = [[Point, Point, ...],[Point, Point, ...]] in order of keys in allocation!
// returns a Point list with the values of the weighted portfolio
const calculatePortfolioPoints = (allocation, stockPointList) => {
    const keys = Object.keys(allocation);
    const weights = keys.map(k => allocation[k]);
    const startValueListOfStocks = stockPointList.map(pl => pl[0].open); // for norming the portfolio start value to 1
    const weightedPointList = stockPointList.map((stock, i) => {
        const weight = weights[i];
        return stock.map(p => {
            return {
                date: p.date,
                open: p.open / startValueListOfStocks[i] * weight,
                high: p.high / startValueListOfStocks[i] * weight,
                low: p.low / startValueListOfStocks[i] * weight,
                close: p.close / startValueListOfStocks[i] * weight,
                adjClose: p.adjClose / startValueListOfStocks[i] * weight,
                volume: p.volume / startValueListOfStocks[i] * weight,
            }
        })
    })
    return weightedPointList[0].map((point, i) => {
        return {
            date: point.date,
            open: weightedPointList.map(s => s[i].open).reduce(add),
            high: weightedPointList.map(s => s[i].high).reduce(add),
            low: weightedPointList.map(s => s[i].low).reduce(add),
            close: weightedPointList.map(s => s[i].close).reduce(add),
            adjClose: weightedPointList.map(s => s[i].adjClose).reduce(add),
            volume: weightedPointList.map(s => s[i].volume).reduce(add),
        }
    })
}

const mult = (total, x) => {
    return total * (1 + x);
}

const add = (total, x) => {
    return total + x;
}
const calculateChange = (arr) => {
    return arr.map((point, i) => {
        if (i === 0) {
            return 0;
        } else {
            return point.open / arr[i - 1].open - 1;
        }
    })
}

const errHandler = (err) => {
    console.error("Error: ", err);
}

module.exports = router;