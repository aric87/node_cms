const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    phone: { type: String },
    email: { type: String },
    emailPassword: { type: String },
    heading: {type:String},
    subheading: {type:String}
});

module.exports = mongoose.model('Client', clientSchema);

