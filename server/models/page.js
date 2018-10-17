const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
	name: { type: String, required: true },
	url: String,
	page_css: String,
	content: String,
	active: { type: Boolean, default: true },
});

module.exports = mongoose.model('Page', pageSchema);
