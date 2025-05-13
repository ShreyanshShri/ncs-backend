const mongoose = require("mongoose");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { users } = require("../../data/users"); // Assuming users are stored in a separate file

const seedUsers = async () => {
	try {
		// Connect to the database
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Connected to the database");

		// Clear existing users
		await User.deleteMany({});
		console.log("Existing users cleared");

		// Hash passwords and insert users
		for (const user of users) {
			user.password = await bcrypt.hash(user.password, 10); // Hash the password with 10 salt rounds
		}

		// Insert dummy users
		await User.insertMany(users);
		console.log("Dummy users inserted");

		// Disconnect from the database
		await mongoose.disconnect();
		console.log("Disconnected from the database");
	} catch (error) {
		console.error("Error seeding users:", error);
		process.exit(1);
	}
};

seedUsers();
