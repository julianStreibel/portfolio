const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const csv = require('csv-parser');
const Sequelize = require("sequelize");
const math = require("mathjs");
const Op = Sequelize.Op;


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

// list all stocks with the substring in query
router.get('/find/:query', async (req, res) => {
    const stocks = await Stock.findAll({ where: { name: { [Op.substring]: req.params.query } } }).catch(errHandler)
    res.json(stocks);
});

// returns the stock with the name with all his points in the year-frame
router.get('/:name/:startYear/:stopYear', async (req, res) => {
    const startYear = req.params.startYear ? req.params.startYear : 0;
    const stopYear = req.params.stopYear ? req.params.stopYear : 0;
    const stock = await Stock.findOne({
        where: { name: req.params.name }, include: [{
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
router.get('/:name', async (req, res) => {
    const stock = await Stock.findOne({
        where: { name: req.params.name }, include: [{
            model: Point, as: "Point"
        }]
    }).catch(errHandler);
    res.json(stock);
})

// returns the stock with the name with all his points
router.get('/:name/:startYear/:stopYear/statistics', async (req, res) => {
    const startYear = req.params.startYear ? req.params.startYear : 0;
    const stopYear = req.params.stopYear ? req.params.stopYear : 0;
    const stock = await Stock.findOne({
        where: { name: req.params.name }, include: [{
            model: Point, as: "Point", where: {
                date: {
                    [Op.lt]: new Date(stopYear, 1),
                    [Op.gt]: new Date(startYear, 1)
                }
            }
        }]
    }).catch(errHandler);
    if (!stock) {
        res.json(null);
    }
    // calculate change from open in stock
    let change = calculateChange(stock.Point);

    // calculate standard deviation and expected value of change
    const stats = {
        std: math.std(change),
        ev: math.mean(change),
        min: math.min(change),
        max: math.max(change),
        oneYear: change.slice(change.length - 250, change.length).reduce(add),
        fiveYears: change.slice(change.length - 1250, change.length).reduce(add),
        tenYears: change.slice(change.length - 2500, change.length).reduce(add),

    };
    res.json([stats, stock]);
})

// lists all stocks without points
router.get('/', async (req, res) => {
    const stocks = await Stock.findAll().catch(errHandler);
    res.json(stocks);
});

// creates new stock
router.post('/', upload.single('csv'), async (req, res) => {
    if (req.body.name) {
        const stock = await Stock.create({
            name: req.body.name
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
router.post('/allocation', multer().none(), async (req, res) => {
    const startYear = req.body.start;
    const stopYear = req.body.stop;
    let stocks = req.body.stocks.split(",");
    stocks = await Promise.all(stocks.map(async s => {
        return await Stock.findOne({
            where: { name: s }, include: [{
                model: Point, as: "Point", where: {
                    date: {
                        [Op.lt]: new Date(stopYear, 1),
                        [Op.gt]: new Date(startYear, 1)
                    }
                }
            }]
        }).catch(errHandler);
    })).catch(errHandler);

    // calculate change in all stocks
    stocks = stocks.map(s => calculateChange(s.Point));
    // make matrix
    let X = math.matrix(stocks);
    // calculate cov matrix
    const cov = math.variance(X);
    console.log(cov)
    //optimize weights

    res.json(cov);
})

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