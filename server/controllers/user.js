const passport = require('passport');
const logger = require('../config/logger');

const isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	if (req.user) {
		logger.warn(`req.auth failed. user: ${req.user}, \n path: ${req.path} band: ${req.band.id} user band:  ${req.user.band}`);
		req.flash('loginMessage', 'There was an error logging you in. If you\'ve recently created a new account, the system administrator may need to activate the account before being able to sign in.');
	} else {
		logger.warn(`req.auth failed. no user, \n path: ${req.path} band: ${req.band.id}`);
	}
	return res.redirect('/login');
};

exports.isLoggedIn = isLoggedIn;
