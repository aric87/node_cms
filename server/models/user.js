const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
	name: String,
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	role: { type: String },
	resetPasswordToken: String,
	resetPasswordExpires: Date,
});

// has&salt on save
userSchema.methods.generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// has&salt on save
userSchema.statics.generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

userSchema.statics.validPassword = (password, user) => bcrypt.compareSync(password, user.password);
// checking if password is valid
userSchema.methods.validPassword = password => bcrypt.compareSync(password, this.password);

userSchema.pre('save', function preSaveFn(next) {
	const user = this;
	if (!user.isModified('password')) return next();
	user.password = user.generateHash(user.password);
	return next();
});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
