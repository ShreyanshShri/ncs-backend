const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	year: {
		type: Number,
		default: 1,
		// required: true, // temperarily removed for testing
	},
	admissionNumber: {
		type: String,
		default: "2023",
		// required: true, // temperarily removed for testing
		// unique: true, // temperarily removed for testing
	},
	bountySubmissions: [
		{
			bountyId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Bounty",
				required: true,
			},
			solutions: [
				{
					from: {
						type: Number,
					},
					to: {
						type: Number,
					},
					page: {
						type: String,
					},
					time: {
						type: Date,
						default: Date.now, // Automatically sets the current date when a solution is added
					},
				},
			],
		},
	],
	clueHuntOrder: [Number],
	clueHuntExpectedAnswer: {
		type: String,
	},
	clueHuntResponse: {
		type: String,
	},
	hasPassedBountyHunt: {
		type: Boolean,
		default: false,
	},
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
