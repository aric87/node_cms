require('./config/connect');
const express = require('express');
const helmet = require('helmet');

const app = express();
app.set('trust proxy', true);
app.use(helmet());
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
const port = 8082;
const appIpAddress = '127.0.0.1';
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const async = require('async');
const redis = require('redis');
const crypto = require('crypto');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const redisHost = 'localhost';
const redisPort = 6379;
const redisClient = redis.createClient({ host: redisHost, port: redisPort });
if (process.env.REDIS_PASSWORD) {
	redisClient.auth(process.env.REDIS_PASSWORD);
}
const swig = require('swig');
const fs = require('fs');
const path = require('path');
const multipart = require('connect-multiparty');
const os = require('os');

const multipartyMiddleware = multipart({ uploadDir: os.tmpdir() });
const { isLoggedIn } = require('./controllers/services');

const logDir = process.env.LOGDIR ? process.env.LOGDIR : __dirname;
const accessLogStream = fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' });

const logger = require('./config/logger');
const { Client } = require('./models/models');

require('./config/passport')(passport, logger); // pass passport for configuration

// set up our express application
app.use(morgan('common', { stream: accessLogStream }));
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // get information from html forms
// required for passport
const rStore = new RedisStore({
	host: redisHost,
	port: redisPort,
	client: redisClient,
	logErrors: true,
});
app.use(session({
	secret: process.env.SESSION_SECRET,
	// create new redis store.
	store: rStore,
	saveUninitialized: false,
	resave: false,
	cookie: { maxAge: 1800000 },
	name: 'NW_CMS',
})
);
// limit requests per hour
const limiter = require('express-limiter')(app, redisClient);

limiter({
	lookup: ['connection.remoteAddress'],
	total: 20,
	expire: 1000 * 120,
});
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', `${__dirname}/static/`);
app.use('*', (req, res, next) => {
	if (!req.headers.client) {
		return next(new Error('No client in header'));
	}
	Client.findOne({ clientCode: req.headers.client }, (err, client) => {
		if (err || !client) {
			err = err || 'no client';
			return next(new Error(err));
		}
		req.client = client;
		return next();
	});
});
app.use(express.static(`${__dirname}/static/`));
if (process.env.DATADIR) {
	app.use(express.static(process.env.DATADIR));
	app.use(process.env.DATADIR, isLoggedIn, (req, res, next) => next());
}

require('./routes/login.js')(app, passport, crypto, logger, async);
require('./routes/content')(app);

app.listen(port, appIpAddress, (err) => {
	logger.info(err);
});
module.exports = app;
