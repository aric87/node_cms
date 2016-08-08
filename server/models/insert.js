const mongoose = require('mongoose');

const insertSchema = new mongoose.Schema({
	content: { type: String, required: true },
	page: { type: String, required: true },
	active: { type: Boolean, default:false, required: true },
    contentType: { type:String, default:'content', required: true},
    image: String,
	order: Number,
	heading:String,
	client:{type:mongoose.Schema.ObjectId, ref:'Client'}
});

module.exports = mongoose.model('Insert', insertSchema);