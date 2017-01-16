const User = require('../models/user');
const { isLoggedIn, emailuser } = require('../controllers/services');

module.exports = function loginInit(app, passport, crypto, logger, async) {
	app.get('/login',
		(req, res) => res.render('common/login', {
			client: req.client,
			message: req.flash('loginMessage'),
		})
	);
    // process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/admin',
		failureRedirect: '/login',
		failureFlash: true,
	}));
	app.get('/signup',
		(req, res) => res.render('common/signup', {
			client: req.client,
			message: '',
		})
	);
	app.post('/signup', (req, res, next) => {
		passport.authenticate('local-signup', (err, user) => {
			if (err) {
				logger.error(` signup post error: ${err}`);
				return next(err);
			}
			if (!user) {
				logger.error(` signup post no user: ${user}`);
				return res.redirect('/');
			}
			const text = `Your account for ${req.client.name} has been created successfully`;
			emailuser(user.email, 'New Account', text).then(() => {
				req.logIn(user, (loginErr) => {
					if (loginErr) {
						logger.error(` signup post login user error: ${loginErr}`);
						req.flash('loginMessage', 'There was an error creating your account. Please try again.');
						return res.redirect('/login');
					}
					return res.redirect('/admin');
				});
			}).catch((catchErr) => {
				logger.error(` email new user err: ${catchErr}`);
				User.remove({ email: user.email }, (createErr) => {
					if (createErr) {
						logger.error(`remove error: ${err}`);
					}
					logger.warn('bad user email account removed');
					req.flash('loginMessage', 'There was a problem sending the welcome email do to an error with the email address you signed up with. This account has been removed. Contact the system admin to correct problem');
					return res.redirect('/login');
				});
			});
		})(req, res, next);
	});
    // LOGOUT ==============================
	app.get('/logout', (req, res) => {
		req.logout();
		return res.redirect('/');
	});
	app.get('/forgot', (req, res) => {
		res.render('common/forgot', {
			client: req.client,
			user: req.user,
		});
	});
	app.post('/forgot', (req, res, next) => {
		logger.info(`${req.body.email} has requested a password reset token`);
		async.waterfall([
			(done) => {
				crypto.randomBytes(20, (err, buf) => {
					const token = buf.toString('hex');
					return done(err, token);
				});
			},
			(token, done) => {
				User.findOne({ email: req.body.email }, (err, user) => {
					if (err) {
						logger.error(`forgot: find user err: ${err}`);
						return next(err);
					}
					if (!user) {
						return res.redirect('/forgot');
					}

					user.resetPasswordToken = token;
					user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
					user.password = User.generateHash(token + Date.now());

					user.save((saveerr) => {
						if (saveerr) {
							logger.error(`forgot: user save err: ${err}`);
						}
						return done(saveerr, token, user);
					});
				});
			},
			(token, user, done) => {
				const text = `You are receiving this because you (or someone else) have requested the reset of the password for your account on ${req.client.name}.\n\n
				Please click on the following link, or paste this into your browser to complete the process:\n\n
				http://${req.headers.host}/reset/${token}\n\n
				If you did not request this, please ignore this email and your password will remain unchanged.\n
				This is an auto-generated email. Responses will be lost in the abyss.`;
				emailuser(user.email, 'Password Reset', text).then((err) => {
					if (err) {
						logger.error(` email new user err: ${err}`);
					}
					return done(err, 'done');
				});
			},
		],
		(err) => {
			if (err) {
				logger.error(` waterfall err: ${err}`);
				return next(err);
			}
			req.logout();
			return res.redirect('/');
		});
	});
	app.get('/reset/:token', (req, res, next) => {
		User.findOne({
			resetPasswordToken: req.params.token,
			resetPasswordExpires: { $gt: Date.now() },
		}, (err, user) => {
			if (err) {
				logger.error(` get reset token finOne err: ${err}`);
				return next(err);
			}
			if (!user) {
				logger.info(`someone tried to reset with a bad token for client ${req.client}`);
				return res.redirect('/forgot');
			}
			logger.info(`${user.email} visited the password reset page with a good token`);
			return res.render('common/reset', {
				client: req.client,
				user,
			});
		});
	});

	app.post('/reset/:token', (req, res, next) => {
		async.waterfall([
			(done) => {
				User.findOne({
					resetPasswordToken: req.params.token,
					resetPasswordExpires: { $gt: Date.now() },
				}, (err, user) => {
					if (err) {
						logger.error(` post reset token finOne err: ${err}`);
						return next(err);
					}
					if (!user) {
						logger.error('User find error for posting reset token');
						return res.redirect('back');
					}
					user.password = req.body.password[0];
					user.resetPasswordToken = null;
					user.resetPasswordExpires = null;
					user.save(function (err) {
						if (err) {
							logger.error(` post reset token user save err: ${err}`);
						}
						logger.info(`${user.email} successfully changed their password`);
						return done(err, user);
					});
				});
			},
			(user, done) => {
				const text = `Hello,\n\n
				This is a confirmation that the password for your account ${user.email} has just been changed.\n`;
				emailuser(user.email, 'Your password has been changed', text)
				.then(() => done(null, 'done'))
				.catch((err) => {
					if (err) {
						logger.error(` email new user err: ${err}`);
					}
					return done(err, 'done');
				});
			},
		],
		(err) => {
			if (err) {
				logger.error(` waterfall reset post err: ${err}`);
			}
			return res.redirect('/login');
		});
	});
};
