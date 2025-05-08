const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Team = require("../../models/Team");
const authenticate = require("../../middleware/authenticate");
const { clues } = require("../../data/clueHuntClues"); // Assuming you have a file that exports the clues array

router.post("/submit-cluehunt", authenticate, async (req, res) => {
	const endTime = new Date(process.env.CLUE_END_TIME); // Fetch the release time from environment variables
	const currentTime = new Date();
	if (currentTime > endTime) {
		return res.status(403).json({
			error:
				"Window for submitting solutions has closed. Please contact the admin for further assistance.",
		});
	}

	try {
		const { clueHuntResponse } = req.body;
		const email = req.user.email; // Assuming `authenticate` middleware attaches the authenticated user's ID to `req.user`

		// Validate the input
		if (!clueHuntResponse) {
			return res
				.status(400)
				.json({ error: "Clue hunt response is required.", success: false });
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

		// Save the clue hunt response
		team.clueHuntResponse = clueHuntResponse;
		team.clueHuntSubmissionTime = new Date(); // Set the current time as the submission time
		await team.save();

		res.status(200).json({
			message: "Clue hunt response submitted successfully.",
			success: true,
		});
	} catch (error) {
		console.error("Error submitting clue hunt response:", error);
		res.status(500).json({ error: "Internal server error.", success: false });
	}
});

router.get("/assigned-clues", authenticate, async (req, res) => {
	try {
		const email = req.user.email; // Assuming `authenticate` middleware attaches the authenticated user's email to `req.user`
		const releaseTime = new Date(process.env.CLUE_RELEASE_TIME); // Fetch the release time from environment variables

		// Check if the current time is past the release time
		const currentTime = new Date();
		if (currentTime < releaseTime) {
			return res.status(403).json({
				error:
					"Clues are not available yet. Please wait until the release time.",
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

		// Fetch the assigned clues using the indices stored in `clueHuntOrder`
		const assignedClues = team.clueHuntOrder.map((index) => {
			return { clue: clues[index].question };
		});

		res.status(200).json({ assignedClues, success: true });
	} catch (error) {
		console.error("Error fetching assigned clues:", error);
		res.status(500).json({ error: "Internal server error.", success: false });
	}
});

module.exports = router;
