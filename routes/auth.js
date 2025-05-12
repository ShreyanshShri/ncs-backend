const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Team = require("../models/Team");
const authenticate = require("../middleware/authenticate");

router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({
			email: email,
		});

		if (user == null || user == undefined) {
			return res.status(400).json({
				message: "No user found",
				success: false,
			});
		}

		const team = await Team.findById(user.team);
		if (team.firstLogin == null || team.firstLogin == undefined) {
			// If the team has not logged in before, set the firstLogin date
			team.firstLogin = Date.now();
			await team.save();
		}

		if ((await bcrypt.compare(password, user.password)) == false) {
			return res.status(400).json({
				message: "Invalid password",
				success: false,
			});
		}

		const token = jwt.sign(
			{ email: email, type: "user" },
			process.env.JWT_SECRET
		);

		res.status(200).json({
			message: "Success",
			token,
			success: true,
		});
	} catch (err) {
		res.status(400).json({
			message: "Failed",
			err: err.message,
			success: false,
		});
	}
});

router.get("/get-user", authenticate, async (req, res) => {
	const email = req.user.email;

	try {
		const user = await User.findOne({ email: email });
		const team = await Team.findById(user.team);

		if (user == null || user == undefined) {
			return res.status(400).json({
				message: "No user found",
				success: false,
			});
		}

		if (team == null || team == undefined) {
			return res.status(400).json({
				message: "No team found",
				success: false,
			});
		}

		res.status(200).json({
			message: "Success",
			name: user.name,
			email: user.email,
			year: user.year,
			admissionNumber: user.admissionNumber,
			team: user.teamId,
			hasPassedBountyHunt: team.hasPassedBountyHunt,
			solutions: team.solutions,
			success: true,
		});
	} catch (err) {
		res.status(400).json({
			message: "Failed",
			err: err.message,
			success: false,
		});
	}
});

router.post("/admin-login", async (req, res) => {
	const { password } = req.body;
	console.log("secret: ", process.env.JWT_SECRET);
	if (password !== process.env.ADMIN_PASSWORD) {
		return res.status(400).json({
			message: "Invalid password",
			success: false,
		});
	}

	const token = jwt.sign(
		{ email: "admin", type: "admin" },
		process.env.JWT_SECRET
	);

	res.status(200).json({
		message: "Success",
		token,
		success: true,
	});
});

module.exports = router;

// router.post("/register", async (req, res) => {
// 	const { email, name, password } = req.body;

// 	try {
// 		const hashedPassword = await bcrypt.hash(password, saltRounds);
// 		const user = new User({
// 			name,
// 			email,
// 			password: hashedPassword,
// 		});

// 		await user.save();

// 		const token = jwt.sign({ email: email }, JWT_SECRET);

// 		res.status(200).json({
// 			message: "Success",
// 			token,
// 		});
// 	} catch (err) {
// 		console.log(err);
// 		res.status(400).json({
// 			message: "Failed",
// 			err: err.message,
// 		});
// 	}
// });
