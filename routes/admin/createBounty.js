const express = require("express");
const router = express.Router();
const Bounty = require("../../models/Bounty");
const isAdmin = require("../../middleware/isAdmin");

router.post("/create-bounty", isAdmin, async (req, res) => {
	try {
		const { name, year, githubLink, solutions } = req.body;

		// Validate required fields
		if (!name || !year || !Array.isArray(solutions)) {
			return res.status(400).json({ error: "Invalid or missing fields" });
		}

		// Create a new bounty
		const newBounty = new Bounty({
			name,
			year,
			solutions,
			githubLink,
		});

		// Save the bounty to the database
		await newBounty.save();

		res
			.status(201)
			.json({ message: "Bounty created successfully", bounty: newBounty });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

module.exports = router;
