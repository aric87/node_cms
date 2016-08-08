"use strict"
var Models = require('../models/models');

exports.run = (callback, errback) => {
	Models.Client.create({
		name: 'Test Client',
	    address: '123 four street',
	    city: 'NY',
	    state: 'NY',
	    phone: '1231231234',
	    email: 'test@test.com',
	    emailPassword: 'woohoo',
	    heading: 'I want you to want me',
	    subheading: 'Coyote ugly'
		},
        function(err, items) {
            if (err) {
                return errback(err);
            }
	Models.Insert.create({
		content: 'test teset atohadf;nadlkadfgldf;lksdfg;lsfdg;l',
		page: 'index',
		active: true,
		client: items.id
	},function(err){
		if (err){
			return errback(err);
		}
	});
	const pw =  Models.User.generateHash('testpassword');
	Models.User.create({
	name: 'test_user',	
	email: 'testuser@test.com',
	password: pw,
	client: items.id

	},function(err){
		if (err){
			return errback(err)
		}
        callback();	
	})
	 });
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