const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Bounty = require("../../models/Bounty");
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
		const email = req.user.email;

		// Validate required fields
		if (
			!bountyId ||
			!solution ||
			!solution.page ||
			solution.from === undefined ||
			solution.to === undefined
		) {
			return res.status(400).json({ error: "Invalid or missing fields" });
		}

		// Check if the bounty exists
		const bounty = await Bounty.findById(bountyId);
		if (!bounty) {
			return res.status(404).json({ error: "Bounty not found" });
		}

		// Find the user
		const user = await User.findOne({ email: email });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Add the solution to the bounty's solutions array
		user.solutions.push({
			...solution,
			time: Date.now(), // Automatically set the current time
		});

		// Save the user document
		await user.save();

		res.status(200).json({ message: "Solution submitted successfully", user });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

router.post("/get-bounties", authenticate, async (req, res) => {
	try {
		const { passkey } = req.body; // Passkey sent by the user in the query parameters
		const email = req.user.email; // Assuming `authenticate` middleware attaches the authenticated user's email to `req.user`
		const releaseTime = new Date(process.env.BOUNTY_RELEASE_TIME); // Fetch the release time from environment variables
		const envPasskey = process.env.BOUNTY_PASSKEY; // Fetch the passkey from environment variables

		// Verify the passkey
		if (!passkey || passkey !== envPasskey) {
			return res.status(403).json({ error: "Invalid or missing passkey." });
		}

		// Check if the current time is past the release time
		const currentTime = new Date();
		if (currentTime < releaseTime) {
			return res.status(403).json({
				error:
					"Bounties are not available yet. Please wait until the release time.",
			});
		}

		// Find the user
		const user = await User.findOne({ email: email });
		if (!user) {
			return res.status(404).json({ error: "User not found." });
		}

		// Fetch bounties of the same year as the user
		const bounty = await Bounty.findById(user.assignedBounty).select(
			"-solutions"
		);

		res.status(200).json({ bounty });
	} catch (error) {
		console.error("Error fetching bounties:", error);
		res.status(500).json({ error: "Internal server error." });
	}
});

module.exports = router;
