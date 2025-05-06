const express = require("express");
const mongoose = require("mongoose");
const auth = require("./auth");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const app = express();

mongoose
	.connect(
		"mongodb+srv://shreyanshshrivastva:VbKawSepWcfMF51o@cluster0.fbm2gtt.mongodb.net/"
	)
	.then((result) => {
		console.log("connected to Mongodb");
	})
	.catch((err) => {
		console.error(err);
	});

app.use(cors());
app.use(express.json());

app.use("/auth", auth);

app.get("/", (req, res) => {
	res.send("Hello World");
});

app.listen(3000, () => console.log("listening on 3000"));
