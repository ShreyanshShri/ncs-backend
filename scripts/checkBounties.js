const mongoose = require("mongoose");
const User = require("../models/User");
const Bounty = require("../models/Bounty");
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

		// Fetch all users
		const users = await User.find();

		// Prepare CSV data
		let csvData = "Name,Admission Number,Year,Correct Responses\n";

		for (const user of users) {
			console.log(`Checking bounties for user: ${user.name} (${user.email})`);

			// Initialize correct responses count
			let correctResponses = 0;

			// If the user has no bounty submissions, skip to the next user
			if (!user.bountySubmissions || user.bountySubmissions.length === 0) {
				console.log(
					"No bounty submissions found for this user. Moving to the next user."
				);
				csvData += `${user.name},${user.admissionNumber},${user.year},${correctResponses}\n`;
				continue;
			}

			// Iterate through each bounty submission of the user
			for (const submission of user.bountySubmissions) {
				// Fetch the corresponding bounty using the bountyId
				const bounty = await Bounty.findById(submission.bountyId);

				if (!bounty) {
					console.log(
						`Bounty with ID ${submission.bountyId} not found. Skipping.`
					);
					continue;
				}

				console.log(`Checking bounty: ${bounty.name}`);

				// Iterate through each solution in the bounty
				for (const bountySolution of bounty.solutions) {
					const matched = submission.solutions.some((userSolution) => {
						return (
							bountySolution.page === userSolution.page &&
							bountySolution.from === userSolution.from &&
							bountySolution.to === userSolution.to
						);
					});

					if (matched) {
						correctResponses++;
					}
				}
			}

			// Add user data to CSV
			csvData += `${user.name},${user.admissionNumber},${user.year},${correctResponses}\n`;
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
