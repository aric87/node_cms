const winston = require('winston');
const path = require('path');

const logDir = process.env.LOGDIR ? process.env.LOGDIR : path.resolve(__dirname, '../');
const logger = new (winston.Logger)({
	transports: [
		new (winston.transports.File)({ filename: `${logDir}/winston.log` }),
	],
});
module.exports = logger;
