const mongoose = require("mongoose");

const BountySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	year: {
		type: Number,
		required: true,
	},
	githubLink: {
		type: String,
		required: true,
	},
	solutions: [
		{
			page: {
				type: String,
				required: true,
			},
			from: {
				type: Number,
				required: true,
			},
			to: {
				type: Number,
				required: true,
			},
		},
	],
});

const Bounty = mongoose.model("Bounty", BountySchema);
module.exports = Bounty;
