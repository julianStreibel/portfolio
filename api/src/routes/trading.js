const express = require('express');
const Sequelize = require("sequelize");
const multer = require('multer');
const Op = Sequelize.Op;

// models
const Stock = require('../models/Stock');

// /api/v1/traiding/...
const router = express.Router();

// log
router.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

const requiresLogin = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    } else {
        var err = new Error('You must be logged in to view this page.');
        err.status = 401;
        return next(err);
    }
}

// get forcast for stockprice 
router.post('/predict', requiresLogin, multer().none(), async (req, res, next) => {
    console.log(req.body);
})

// list all stocks with the substring in query
router.get('/test', requiresLogin, async (req, res) => {
    res.json("you passed the test");
});

const errHandler = (err) => {
    console.error("Error: ", err);
};

module.exports = router;