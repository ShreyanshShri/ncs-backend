const mongoose = require("mongoose");
const Team = require("../../models/Team");
require("dotenv").config();

const updatePassStatus = async () => {
	try {
		// Connect to the database
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Connected to the database");

		// Fetch all teams
		const teams = await Team.find();

		// Update `hasPassedBountyHunt` based on `solutions`
		for (const team of teams) {
			if (team.solutions.length === 0) {
				team.hasPassedBountyHunt = false;
			} else {
				team.hasPassedBountyHunt = true;
			}
			await team.save();
			console.log(
				`Updated hasPassedBountyHunt for team: ${team.teamId} to ${team.hasPassedBountyHunt}`
			);
		}

		// Disconnect from the database
		await mongoose.disconnect();
		console.log("Disconnected from the database");
	} catch (error) {
		console.error("Error updating teams:", error);
		process.exit(1);
	}
};

updatePassStatus();
