const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
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
			});
		}

		if ((await bcrypt.compare(password, user.password)) == false) {
			return res.status(400).json({
				message: "Invalid password",
			});
		}

		const token = jwt.sign(
			{ email: email, type: "user" },
			process.env.JWT_SECRET
		);

		res.status(200).json({
			message: "Success",
			token,
		});
	} catch (err) {
		res.status(400).json({
			message: "Failed",
			err: err.message,
		});
	}
});

router.get("/get-user", authenticate, async (req, res) => {
	const email = req.user.email;

	try {
		const user = await User.findOne({ email: email });

		if (user == null || user == undefined) {
			return res.status(400).json({
				message: "No user found",
			});
		}

		res.status(200).json({
			message: "Success",
			name: user.name,
			email: user.email,
			bountySubmissions: user.bountySubmissions,
			year: user.year,
			admissionNumber: user.admissionNumber,
			clueHuntOrder: user.clueHuntOrder,
		});
	} catch (err) {
		res.status(400).json({
			message: "Failed",
			err: err.message,
		});
	}
});

router.post("/admin-login", async (req, res) => {
	const { password } = req.body;
	console.log("secret: ", process.env.JWT_SECRET);
	if (password !== process.env.ADMIN_PASSWORD) {
		return res.status(400).json({
			message: "Invalid password",
		});
	}

	const token = jwt.sign(
		{ email: "admin", type: "admin" },
		process.env.JWT_SECRET
	);

	res.status(200).json({
		message: "Success",
		token,
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
