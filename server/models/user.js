const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	role: { type:String, default:'client'},
	client:{type:mongoose.Schema.ObjectId, ref:'Client'},
    password: { type: String, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

//has&salt on save
userSchema.statics.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// checking if password is valid
userSchema.statics.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);