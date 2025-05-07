const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");
require("dotenv").config();

const seedUsers = async () => {
	try {
		// Connect to the database
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Connected to the database");

		// Dummy users data
		const users = [
			{
				name: "John Doe",
				email: "john.doe@example.com",
				password: "password123", // Ideally, hash passwords before saving
				year: 1,
				admissionNumber: "2023001",
			},
			{
				name: "Jane Smith",
				email: "jane.smith@example.com",
				password: "password123",
				year: 2,
				admissionNumber: "2023002",
			},
			{
				name: "Alice Johnson",
				email: "alice.johnson@example.com",
				password: "password123",
				year: 1,
				admissionNumber: "2023003",
			},
		];

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
