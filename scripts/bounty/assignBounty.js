const mongoose = require("mongoose");
const Team = require("../../models/Team");
const Bounty = require("../../models/Bounty");
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

		const teams = await Team.find();

		for (const team of teams) {
			// Filter bounties for the same year as the team
			const eligibleBounties = bounties.filter(
				(bounty) => bounty.year === team.year
			);

			if (eligibleBounties.length === 0) {
				console.log(`No eligible bounties found for team: ${team.name})`);
				continue;
			}

			// Assign a random bounty from the eligible bounties
			const randomBounty =
				eligibleBounties[Math.floor(Math.random() * eligibleBounties.length)];
			team.assignedBounty = randomBounty._id;

			// Save the updated team
			await team.save();
			console.log(
				`Assigned bounty "${randomBounty.name}" to team: ${team.name}`
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
