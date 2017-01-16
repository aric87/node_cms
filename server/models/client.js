const mongoose = require('mongoose');
const User = require('./user');
const Page = require('./page');

const Schema = mongoose.Schema;
const clientSchema = new mongoose.Schema({
	name: { type: String, required: true },
	url: String,
	clientCode: { type: String, required: true, unique: true },
	description: String,
	analyticsCode: String,
	facebook: String,
	twitter: String,
	youtube: String,
	address: { type: String },
	city: { type: String },
	state: { type: String },
	phone: { type: String },
	email: { type: String },
	emailPassword: { type: String },
	users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	pages: [{ type: Schema.Types.ObjectId, ref: 'Page' }],
});

module.exports = mongoose.model('Client', clientSchema);
