const mongoose = require("mongoose");
const Team = require("../../models/Team");
const Bounty = require("../../models/Bounty");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const checkBounties = async () => {
	try {
		// Connect to the database
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Connected to the database");

		// Fetch all teams
		const teams = await Team.find().populate("assignedBounty");

		// Prepare CSV data
		let csvData = "Team ID,Year,Correct Responses\n";

		for (const team of teams) {
			console.log(`Processing team: ${team.teamId}`);

			// Initialize correct responses count
			let correctResponses = 0;

			// Check if the team has an assigned bounty
			if (!team.assignedBounty) {
				console.log(`No assigned bounty for team: ${team.teamId}`);
				csvData += `${team.teamId},${team.year},${correctResponses}\n`;
				continue;
			}

			// Iterate through each solution in the assigned bounty
			for (const bountySolution of team.assignedBounty.solutions) {
				// Check if the team's solutions match the bounty's solution
				let matched = false;

				for (const teamSolution of team.solutions) {
					console.log(teamSolution, bountySolution);
					if (
						teamSolution.from === bountySolution.from &&
						teamSolution.to === bountySolution.to &&
						teamSolution.filename === bountySolution.filename
					) {
						matched = true;
					}
				}

				if (matched) {
					correctResponses++;
				}
			}

			// Update the team's correctResponses field
			team.correctResponses = correctResponses;
			await team.save();
			console.log(
				`Updated correctResponses for team: ${team.teamId} to ${correctResponses}`
			);

			// Add team data to CSV
			csvData += `${team.teamId},${team.year},${correctResponses}\n`;
		}

		// Write CSV data to a file
		const filePath = path.join(__dirname, "bounty_results.csv");
		fs.writeFileSync(filePath, csvData);
		console.log(`CSV file created at: ${filePath}`);

		// Disconnect from the database
		await mongoose.disconnect();
		console.log("Disconnected from the database");
	} catch (error) {
		console.error("Error checking bounties:", error);
		process.exit(1);
	}
};

checkBounties();
