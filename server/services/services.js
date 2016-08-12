module.exports = (models) => {
var client = require('./client')(models);
var insert = require('./inserts')(models);

	return {
		client,
		insert
	}
}