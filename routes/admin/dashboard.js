const express = require("express");
const router = express.Router();
const Team = require("../../models/Team");
const isAdmin = require("../../middleware/isAdmin");

router.get("/", isAdmin, async (req, res) => {
	try {
		const teams = await Team.find()
			.populate("assignedBounty")
			.populate("users");

		res.status(200).json({ success: true, teams });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});

module.exports = router;
