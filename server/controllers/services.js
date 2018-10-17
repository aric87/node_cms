const { uploadFile } = require('./files');
const { isLoggedIn } = require('./user');
const { emailuser, sendMessage, messageData } = require('./email');

module.exports = {
	uploadFile,
	isLoggedIn,
	sendMessage,
	messageData,
	emailuser,
};
