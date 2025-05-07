const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const app = express();

const createBounty = require("./routes/admin/createBounty");
const bounty = require("./routes/userActions/bounty");
const auth = require("./routes/auth");
const clueHunt = require("./routes/userActions/clueHunt");

mongoose
	.connect(process.env.MONGO_URI)
	.then((result) => {
		console.log("connected to Mongodb");
	})
	.catch((err) => {
		console.error(err);
	});

app.use(cors());
app.use(express.json());

app.use("/auth", auth);
app.use("/admin", createBounty);
app.use("/bounty", bounty);
app.use("/cluehunt", clueHunt);

app.get("/", (req, res) => {
	res.send("Hello World");
});

app.listen(3000, () => console.log("listening on 3000"));
