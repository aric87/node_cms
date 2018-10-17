const mongoose = require('mongoose');
// default to a 'localhost' configuration:
mongoose.Promise = global.Promise;
let connectionString = '127.0.0.1:27017/cms-dev';
if (process.env.DATADIR) {
	connectionString = '127.0.0.1:27017/cms';
}

mongoose.connect(`mongodb://${connectionString}`);
