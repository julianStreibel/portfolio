const express = require('express');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const bcrypt = require('bcrypt');

// models
const Account = require('../models/Account');

// /api/v1/accounts/...
const router = express.Router();

// log
router.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

// register an account
// req.body = { name, mail, password }
router.post('/register/', async (req, res) => {
    let user = req.body;
    const shouldBeEmpty = await Account.findAll({
        where: {
            [Op.or]: [{ name: user.name }, { mail: user.mail }]
        }
    }).catch(errHandler);
    if (shouldBeEmpty.length === 0) {
        user.password = await bcrypt.hash(user.password, 10);
        const account = await Account.create({ name: user.name, mail: user.mail, password: user.password });
        req.session.userId = account.id;
        res.json(account);
    } else {
        console.log(shouldBeEmpty)
        res.json({ error: "E-Mail or Name already exists" });
    }
});

// log into an account
router.post('/login/', async (req, res) => {
    let name = req.body.name; //could also be the email
    let password = req.body.password;

    const user = await Account.findOne({
        where: {
            [Op.or]: [{ name: name }, { mail: name }]
        }
    })
    if (user) {
        const isUser = await bcrypt.compare(password, user.password)
        if (isUser) {
            req.session.userId = user.id;
            res.json({ name: user.name });
        } else {
            res.json({ error: "Wrong password" });
        }
    } else {
        res.json({ error: "E-Mail or Name dont exists" });
    }
})

// logout 
router.get('/logout', async (req, res, next) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            } else {
                return res.json('logged out');
            }
        });
    }

    console.log(req.session);
})

const requiresLogin = (req, res, next) => {
    console.log("s in acc", req.session)
    if (req.session && req.session.userId) {
        return next();
    } else {
        var err = new Error('You must be logged in to view this page.');
        err.status = 401;
        return next(err);
    }
}

// list all stocks with the substring in query
router.get('/test', requiresLogin, async (req, res) => {
    res.json("you passed the test");
});



const errHandler = (err) => {
    console.error("Error: ", err);
};

module.exports = router;
