const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
	teamId: {
		type: String,
		required: true,
		unique: true,
	},
	users: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User", // Reference to the User model
		},
	],
	year: {
		type: Number,
		default: 1,
		// required: true, // temperarily removed for testing
	},
	assignedBounty: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Bounty",
	},
	solutions: [
		{
			from: {
				type: Number,
			},
			to: {
				type: Number,
			},
			filename: {
				type: String,
			},
			time: {
				type: Date,
				default: Date.now, // Automatically sets the current date when a solution is added
			},
		},
	],
	correctResponses: {
		type: Number,
		default: 0,
	},
	clueHuntOrder: [Number],
	clueHuntExpectedAnswer: {
		type: String,
	},
	clueHuntResponse: {
		type: String,
	},
	clueHuntSubmissionTime: {
		type: Date,
	},
	hasPassedBountyHunt: {
		type: Boolean,
		default: false,
	},
});

const Team = mongoose.model("Team", TeamSchema);
module.exports = Team;
