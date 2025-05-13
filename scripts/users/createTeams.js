const mongoose = require("mongoose");
const fs = require("fs");
const User = require("../../models/User");
const Team = require("../../models/Team");
require("dotenv").config();

const loadUsersFromCSV = async () => {
	try {
		// Connect to the database
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Connected to the database");

		const users = await User.find();
		for (const user of users) {
			console.log(user.teamId);
			const team = await Team.findOne({ teamId: user.teamId });
			console.log(team);
			if (team) {
				user.team = team._id;
				await user.save();
				team.users.push(user._id);
				await team.save();
			} else {
				const newTeam = new Team({
					teamId: user.teamId,
					year: user.year,
				});
				newTeam.users.push(user._id);
				await newTeam.save();

				user.team = newTeam._id;
				await user.save();
			}
		}
	} catch (error) {
		console.log(error);
	}
};

loadUsersFromCSV();
