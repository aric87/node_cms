const sender = require('superagent');
const logger = require('../config/logger');

const messageData = (sendTo, subject, text) => {
	return {
		sendTo,
		subject,
		text,
		highland: false,
		slackOption: false,
	};
};

const sendMessage = (mailOptions, callback) => {
	sender
	.post(process.env.emailServiceUrl)
	.send(mailOptions)
	.end(callback);
};

const emailuser = function emailuser(userEmail, subject, content) {
	return new Promise((resolve, reject) => {
		const mailOptions = messageData(userEmail, subject, content);
		sendMessage(mailOptions, (err) => {
			if (err) {
				logger.error(` email userEmail err: ${err}, user: ${userEmail}, subject ${subject}, content: ${content}`);
				return reject(err);
			}
			return resolve();
		});
	});
};

exports.emailuser = emailuser;
exports.sendMessage = sendMessage;
exports.messageData = messageData;
