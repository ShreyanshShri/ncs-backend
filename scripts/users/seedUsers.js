const mongoose = require("mongoose");
const fs = require("fs");
const csvParser = require("csv-parser");
const User = require("../../models/User");
require("dotenv").config();

const parseCSV = (csvFilePath) => {
	return new Promise((resolve, reject) => {
		const users = [];

		fs.createReadStream(csvFilePath)
			.pipe(csvParser())
			.on("data", (row) => {
				users.push({
					name: row.name,
					email: row.email,
					mobile: row.mobile,
					zealId: row.zealId,
					password: row.zealId,
					year: parseInt(row.year, 10),
					admissionNumber: row.admissionNumber,
					teamId: row.teamName,
				});

				if (row.teamM1 != "") {
					users.push({
						name: row.teamM1,
						mobile: row.teamM1Mobile,
						zealId: row.teamM1ZealId,
						password: row.teamM1ZealId,
						year: parseInt(row.year, 10),
						admissionNumber: "N/A",
						teamId: row.teamName,
					});
				}

				if (row.teamM2 != "") {
					users.push({
						name: row.teamM2,
						mobile: row.teamM2Mobile,
						zealId: row.teamM2ZealId,
						password: row.teamM2ZealId,
						year: parseInt(row.year, 10),
						admissionNumber: "N/A",
						teamId: row.teamName,
					});
				}
			})
			.on("end", () => resolve(users))
			.on("error", reject);
	});
};

const loadUsersFromCSV = async () => {
	const csvFilePath = "./scripts/users/users.csv";

	try {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Connected to MongoDB");

		const users = await parseCSV(csvFilePath);
		console.log("CSV parsed, saving users...");

		await User.insertMany(users);
		console.log("Users successfully saved to the database");

		await mongoose.disconnect();
		console.log("Disconnected from MongoDB");
	} catch (error) {
		console.error("Error loading users from CSV:", error);
		process.exit(1);
	}
};

loadUsersFromCSV();
