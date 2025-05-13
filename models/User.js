const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		// unique: true,
	},
	mobile: {
		type: String,
		// unique: true,
	},
	zealId: {
		type: String,
		required: true,
		// unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	year: {
		type: Number,
		default: 1,
		required: true, // temperarily removed for testing
	},
	admissionNumber: {
		type: String,
		default: "2023",
	},
	teamId: {
		type: String,
		// required: true, // temperarily removed for testing
	},
	team: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Team",
	},
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
