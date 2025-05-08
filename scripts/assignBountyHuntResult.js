const mongoose = require("mongoose");
const User = require("../models/User");
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
		const users = await User.find();

		// Sort users by `correctResponses` in descending order
		const sortedUsers = users.sort(
			(a, b) => b.correctResponses - a.correctResponses
		);

		// Get the top 10 users
		const topUsers = sortedUsers.slice(0, 2);

		// Update `hasPassedBountyHunt` to true for the top 10 users
		for (const user of topUsers) {
			user.hasPassedBountyHunt = true;
			await user.save();
			console.log(
				`Updated hasPassedBountyHunt for user: ${user.name} (${user.email})`
			);
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
