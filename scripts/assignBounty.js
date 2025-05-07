const mongoose = require("mongoose");
const User = require("../models/User");
const Bounty = require("../models/Bounty");
require("dotenv").config();

const assignBounty = async () => {
	try {
		// Connect to the database
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Connected to the database");

		// Fetch all bounties
		const bounties = await Bounty.find();
		if (bounties.length === 0) {
			throw new Error("No bounties found in the database.");
		}

		// Fetch all users
		const users = await User.find();
		if (users.length === 0) {
			throw new Error("No users found in the database.");
		}

		for (const user of users) {
			// Filter bounties for the same year as the user
			const eligibleBounties = bounties.filter(
				(bounty) => bounty.year === user.year
			);

			if (eligibleBounties.length === 0) {
				console.log(
					`No eligible bounties found for user: ${user.name} (${user.email})`
				);
				continue;
			}

			// Assign a random bounty from the eligible bounties
			const randomBounty =
				eligibleBounties[Math.floor(Math.random() * eligibleBounties.length)];
			user.assignedBounty = randomBounty._id;

			// Save the updated user
			await user.save();
			console.log(
				`Assigned bounty "${randomBounty.name}" to user: ${user.name} (${user.email})`
			);
		}

		// Disconnect from the database
		await mongoose.disconnect();
		console.log("Disconnected from the database");
	} catch (error) {
		console.error("Error assigning bounties:", error);
		process.exit(1);
	}
};

assignBounty();
