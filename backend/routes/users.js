const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

usersRouter.get("/", async (req, res) => {
	const allUsers = await User.find({}).populate("notes", {content: true, date: true});

	res.status(200).send(allUsers);
});

usersRouter.post("/", async (req, res) => {
	const {username, name, password} = req.body;

	const existingUser = await User.findOne({username});
	if(existingUser) {
		return res.status(400).json({
			error: "username must be unique"
		});
	}

	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(password, saltRounds);

	const user = new User({
		username,
		name,
		passwordHash
	});

	const savedUser = await user.save();

	res.status(201).send(savedUser);
});

module.exports = usersRouter;