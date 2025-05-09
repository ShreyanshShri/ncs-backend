const mongoose = require("mongoose");
const User = require("../../models/User");
const Team = require("../../models/Team");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const checkClueHunt = async () => {
	try {
		// Connect to the database
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Connected to the database");

		// Fetch all users
		const teams = await Team.find().populate("users");

		// Prepare CSV data
		let csvData =
			"Team Id,Year,ClueHuntExpectedAnswer,ClueHuntResponse,isCorrect\n";

		for (const team of teams) {
			console.log(`Checking clue hunt for user: ${team.teamId}`);

			// Compare clueHuntExpectedAnswer with clueHuntResponse
			const isCorrect = team.clueHuntExpectedAnswer === team.clueHuntResponse;

			// Add user data to CSV
			csvData += `${team.teamId},${team.year},"${team.clueHuntExpectedAnswer}","${team.clueHuntResponse}",${isCorrect}\n`;
		}

		// Write CSV data to a file
		const filePath = path.join(__dirname, "clue_hunt_results.csv");
		fs.writeFileSync(filePath, csvData);
		console.log(`CSV file created at: ${filePath}`);

		// Disconnect from the database
		await mongoose.disconnect();
		console.log("Disconnected from the database");
	} catch (error) {
		console.error("Error checking clue hunt:", error);
		process.exit(1);
	}
};

checkClueHunt();
