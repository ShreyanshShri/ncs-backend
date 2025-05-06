const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const JWT_SECRET = "mysecretkey";

const User = require("./models/User");

router.post("/register", async (req, res) => {
	const { email, name, password } = req.body;

	try {
		const hashedPassword = await bcrypt.hash(password, saltRounds);
		const user = new User({
			name,
			email,
			password: hashedPassword,
		});

		await user.save();

		const token = jwt.sign({ email: email }, JWT_SECRET);

		res.status(200).json({
			message: "Success",
			token,
		});
	} catch (err) {
		console.log(err);
		res.status(400).json({
			message: "Failed",
			err: err.message,
		});
	}
});

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

		const token = jwt.sign({ email: email }, JWT_SECRET);

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

router.post("/get-user", async (req, res) => {
	const { token } = req.body;

	try {
		const decoded = jwt.verify(token, JWT_SECRET);

		const user = await User.findOne({ email: decoded.email });

		if (user == null || user == undefined) {
			return res.status(400).json({
				message: "No user found",
			});
		}

		res.status(200).json({
			message: "Success",
			name: user.name,
		});
	} catch (err) {
		res.status(400).json({
			message: "Failed",
			err: err.message,
		});
	}
});

module.exports = router;
