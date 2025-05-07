const mongoose = require("mongoose");
const User = require("../models/User");
const { clues } = require("../data/clueHuntClues"); // Assuming clues are stored in a separate file
require("dotenv").config();

const assignClues = async () => {
	try {
		// Connect to the database
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Connected to the database");

		// Fetch all users
		const users = await User.find();

		// Get the total number of clues
		const totalClues = clues.length;

		for (const user of users) {
			console.log(`Assigning clues to user: ${user.name} (${user.email})`);

			// Generate a random order of clue indices
			const randomIndices = Array.from(
				{ length: totalClues },
				(_, i) => i
			).sort(() => Math.random() - 0.5);

			// Combine the answers of the clues in the random order
			const combinedAnswers = randomIndices
				.map((index) => clues[index].answer)
				.join("");

			// Assign the random indices and combined answers to the user
			user.clueHuntOrder = randomIndices;
			user.clueHuntExpectedAnswer = combinedAnswers;

			// Save the updated user
			await user.save();

			console.log(`Clues assigned to user: ${user.name}`);
		}

		// Disconnect from the database
		await mongoose.disconnect();
		console.log("Disconnected from the database");
	} catch (error) {
		console.error("Error assigning clues:", error);
		process.exit(1);
	}
};

assignClues();
