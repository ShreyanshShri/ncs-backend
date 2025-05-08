const mongoose = require("mongoose");
const Team = require("../../models/Team");
require("dotenv").config();

const evaluateBountyHunt = async () => {
	try {
		// Connect to the database
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Connected to the database");

		// Fetch all users
		const teams = await Team.find();

		// Sort users by `correctResponses` in descending order
		const sortedTeams = teams.sort(
			(a, b) => b.correctResponses - a.correctResponses
		);

		// Get the top 10 users
		const topTeams = sortedTeams.slice(0, 2);

		// Update `hasPassedBountyHunt` to true for the top 10 users
		for (const team of topTeams) {
			team.hasPassedBountyHunt = true;
			await team.save();
			console.log(`Updated hasPassedBountyHunt for user: ${team.teamId}`);
		}

		// Disconnect from the database
		await mongoose.disconnect();
		console.log("Disconnected from the database");
	} catch (error) {
		console.error("Error evaluating bounty hunt:", error);
		process.exit(1);
	}
};

evaluateBountyHunt();
