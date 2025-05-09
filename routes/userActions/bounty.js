const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Bounty = require("../../models/Bounty");
const Team = require("../../models/Team");
const authenticate = require("../../middleware/authenticate");

router.post("/submit-solution", authenticate, async (req, res) => {
	const endTime = new Date(process.env.BOUNTY_END_TIME); // Fetch the release time from environment variables
	const currentTime = new Date();
	if (currentTime > endTime) {
		return res.status(403).json({
			error:
				"Window for submitting solutions has closed. Please contact the admin for further assistance.",
		});
	}
	try {
		const { bountyId, solution } = req.body;

		const user = await User.findOne({ email: req.user.email });
		if (!user) {
			return res.status(404).json({ error: "User not found", success: false });
		}

		const teamId = user.team;

		// Validate required fields
		if (!bountyId || !solution) {
			return res
				.status(400)
				.json({ error: "Invalid or missing fields", success: false });
		}

		// Check if the bounty exists
		const bounty = await Bounty.findById(bountyId);
		if (!bounty) {
			return res
				.status(404)
				.json({ error: "Bounty not found", success: false });
		}

		// Find the user
		const team = await Team.findById(teamId);
		if (!team) {
			return res.status(404).json({ error: "Team not found", success: false });
		}

		// Add the solution to the bounty's solutions array
		team.solutions.push({
			...solution,
			time: new Date(), // Set the current time as the submission time
		});

		// Save the user document
		await team.save();

		res.status(200).json({
			message: "Solution submitted successfully",
			team,
			success: true,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

router.get("/get-bounties", authenticate, async (req, res) => {
	try {
		const email = req.user.email; // Assuming `authenticate` middleware attaches the authenticated user's email to `req.user`
		const releaseTime = new Date(process.env.BOUNTY_RELEASE_TIME); // Fetch the release time from environment variables

		// Check if the current time is past the release time
		const currentTime = new Date();
		if (currentTime < releaseTime) {
			return res.status(403).json({
				error:
					"Bounties are not available yet. Please wait until the release time.",
				success: false,
			});
		}

		// Find the user
		const user = await User.findOne({ email: email });
		if (!user) {
			return res.status(404).json({ error: "User not found.", success: false });
		}

		const team = await Team.findById(user.team); // Populate the team field
		if (!team) {
			return res.status(404).json({ error: "Team not found.", success: false });
		}

		// Fetch bounties of the same year as the user
		const bounty = await Bounty.findById(team.assignedBounty).select(
			"-solutions"
		);

		res.status(200).json({ bounty, releaseTime, success: true });
	} catch (error) {
		console.error("Error fetching bounties:", error);
		res.status(500).json({ error: "Internal server error.", success: false });
	}
});

module.exports = router;
