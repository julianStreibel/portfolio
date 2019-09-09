'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');

// Database
require('./src/database/connection');
require('./src/database/bootstrap')();

// import routes
const stocks = require('./src/routes/stock');
const accounts = require('./src/routes/account');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

//use sessions for tracking logins
app.use(session({
    secret: 'work hard', // TODO: set to an random string
    resave: true,
    saveUninitialized: false,
    cookie: {
        path: '/',
        _expires: null,
        originalMaxAge: null,
        httpOnly: false
    }
}));
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/v1/stocks', stocks);
app.use('/api/v1/accounts', accounts);

// test
app.get('/api/v1/test', (req, res) => {
    res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);