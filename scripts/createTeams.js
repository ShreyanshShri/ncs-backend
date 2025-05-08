const mongoose = require("mongoose");
const User = require("../models/User");
const Team = require("../models/Team");
require("dotenv").config();

const createTeams = async () => {
	try {
		// Connect to the database
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Connected to the database");

		// Fetch all users
		const users = await User.find();

		// Process users and assign them to teams
		for (const user of users) {
			// Check if the team already exists
			let team = await Team.findOne({ teamId: user.teamId });

			// If the team doesn't exist, create it
			if (!team) {
				team = new Team({
					teamId: user.teamId,
					users: [],
				});
				await team.save();
				console.log(`Created new team: ${team.teamId}`);
			}

			// Add the user to the team if not already added
			if (!team.users.includes(user._id)) {
				team.users.push(user._id);
				await team.save();
				console.log(`Assigned user ${user.name} to team ${team.teamId}`);
			}

			// Assign the team to the user
			user.team = team._id;
			await user.save();
		}

		// Process teams and assign the largest year to each team
		const teams = await Team.find().populate("users");
		for (const team of teams) {
			// Find the user with the largest year in the team
			const largestYear = Math.max(...team.users.map((user) => user.year));
			team.year = largestYear;
			await team.save();
			console.log(`Assigned year ${largestYear} to team ${team.teamId}`);
		}

		// Disconnect from the database
		await mongoose.disconnect();
		console.log("Disconnected from the database");
	} catch (error) {
		console.error("Error creating teams:", error);
		process.exit(1);
	}
};

createTeams();
