const mongoose = require("mongoose");
const Team = require("../../models/Team");
const { clues } = require("../../data/clueHuntClues"); // Assuming clues are stored in a separate file
require("dotenv").config();

const assignClues = async () => {
	try {
		// Connect to the database
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Connected to the database");

		// Fetch all teams
		const teams = await Team.find();

		// Get the total number of clues
		const totalClues = clues.length;
		const cluesToAssign = 5; // Number of clues to assign to each team

		for (const team of teams) {
			console.log(`Assigning clues to team: ${team.teamId}`);

			// Generate a random order of clue indices and select only 5
			const randomIndices = Array.from({ length: totalClues }, (_, i) => i)
				.sort(() => Math.random() - 0.5)
				.slice(0, cluesToAssign);

			// Combine the answers of the selected clues in the random order
			const combinedAnswers = randomIndices
				.map((index) => clues[index].answer)
				.join("");

			// Assign the random indices and combined answers to the team
			team.clueHuntOrder = randomIndices;
			team.clueHuntExpectedAnswer = combinedAnswers;

			// Save the updated team
			await team.save();

			console.log(`Clues assigned to team: ${team.teamId}`);
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
