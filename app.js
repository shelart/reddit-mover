const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const loginRouter = require('./routes/login');
const subscribeRouter = require('./routes/reddit-subscriptions');
const savedRouter = require('./routes/reddit-saved');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/api/login', loginRouter);
app.use('/api/subscriptions', subscribeRouter);
app.use('/api/saved', savedRouter);

module.exports = app;
