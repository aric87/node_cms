'use strict';
require('./config/connect');
const express = require('express');
const app = express();
const port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8000;
const app_ip_address = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
const mongoose = require('mongoose');
const passport = require('passport');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const session  = require('express-session');
const models = require('./models/models');
const swig = require('swig');
const fs = require('fs');
const path = require('path');// set up our express application

// create a write stream (in append mode)
if (process.env.OPENSHIFT_NODEJS_PORT){
	var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})
}
// setup the logger
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/client');
app.use(morgan('combined', {stream: accessLogStream}));
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // get information from html forms
// required for passport
app.use(session({ secret: 'cmsApp', cookie: { maxAge: 360000 }, resave: true, saveUninitialized: true})); // session secret

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(express.static(__dirname + '/client'));

// routes ======================================================================
require('./routes/content')(app, models)
// launch ======================================================================
app.listen(port,app_ip_address, (err) => {
    if(err) console.log(err)
    console.log('The magic happens on port ' + port);
});
module.exports = app;