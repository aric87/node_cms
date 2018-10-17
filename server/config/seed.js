"use strict"
const { Client, User} = require('../models/models');

exports.run = (callback, errback) => {
	Client.create( {
		name: 'Tester',
		url: 'tester.com',
		clientCode: 'tester',
		description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
		analyticsCode: '<script>console.log("shenanigangs")</script>',
		facebook: '',
		twitter: '',
		youtube: '',
		address: '',
		city: '',
		state: '',
		phone: '',
		email: '',
		emailPassword: '',
		users: [],
		pages: [],
	}, function(err){
			if (err){
				return errback()
			}
			return callback()
	})
};

if (require.main === module) {
    require('./connect');
    exports.run(function() {
        var mongoose = require('mongoose');
        mongoose.disconnect();
    }, function(err) {
        console.error(err);
    });
};
