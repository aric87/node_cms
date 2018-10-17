const LocalStrategy = require('passport-local').Strategy;
const { User, Client } = require('../models/models');

module.exports = function initPassport(passport, logger) {
    // used to serialize the user for the session
	passport.serializeUser((user, done) => done(null, user.id));
    // used to deserialize the user
	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => done(err, user));
	});
	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true,
	},
	(req, email, password, done) => {
		Client.populate(req.client, {
			path: 'users',
			match: { email },
			options: { limit: 1 },
		}, (err, client) => {
			const user = client.users[0];
			if (err) {
				logger.error(`Login error: ${err}, \n email: ${email}`);
				return done(err);
			}
			// if no user is found, return the message
			if (!user || !user.validPassword(password)) {
				logger.warn(`Invalid login attempt. \n email: ${email}, \n pass: ${password}`);
				return done(null, false, req.flash('loginMessage', 'Username or Password are incorrect'));
			}
			if (!user.active) {
				logger.warn(`Inactive login attempt. \n email: ${email}`);
				return done(null, false, req.flash('loginMessage', 'Your user account is inactive. Contact your system administrator to get it reactivated'));
			}
			if (user.role !== 'admin' && user.role !== 'member') {
				logger.warn(`Invalid role attempt. \n email: ${email} role: ${user.role}`);
				return done(null, false, req.flash('loginMessage', 'Your user account hasn\'t been enabled by an admin. Contact your system administrator.'));
			}
			logger.info(`${user.email} has logged in`);
			return done(null, user);
		});
	}));
	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true,
	},
	(req, email, password, done) => {
		Client.populate(req.client, {
			path: 'users',
			match: { email },
			options: { limit: 1 },
		}, (err, existingUser) => {
			const newUser = new User();
			if (err) {
				logger.error(`Signup error: ${err} \n email: ${email}`);
				return done(err);
			}
			if (existingUser) {
				logger.warn(`Signup with existing email: \n email: ${email}`);
				return done(null, false, req.flash('loginMessage', 'That email already has an account. Contact your system administrator if you think that\'s an error, or reset your password.'));
			}
			if (req.user) {
				return done(null, req.user);
			}
			// create the user
			newUser.email = email;
			newUser.password = password;
			newUser.name = req.body.name;
			newUser.role = req.band.defaultStartRole;
			newUser.save((saveUserErr) => {
				if (saveUserErr) {
					logger.error(`user create erro on signup: ${err}, \n email: ${email},`);
					throw err;
				}
				req.client.users.push(newUser.id);
				req.client.save((saveClientErr) => {
					if (saveClientErr) {
						logger.error(`error putting the user in the client ${req.client}, ${newUser.name}`);
						return done(err);
					}
					logger.info(`new user created: ${newUser.name}, \n email: ${newUser.email},`);
					return done(null, newUser);
				});
			});
		});
	})
);
};
