const notesRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Note = require("../models/note");
const User = require("../models/user");

const getTokenFrom = req => {
	const authorization = req.get("Authorization");
	if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
		return authorization.substring(7);
	}
	return null;
};

const getDecodedToken = token => {
	try {
		return decodedToken = jwt.verify(token, process.env.SECRET);
	}
	catch(error) {
		return undefined;
	}
}

notesRouter.get("/", async (request, response) => {
	const notes = await Note.find({}).populate("user", { username: true, name: true });

	response.status(200).json(notes);
});

notesRouter.get(":id", (request, response) => {
	Note.findById(request.params.id).then(note => {
		response.json(note);
	});
});

notesRouter.post("/", async (request, response, next) => {
	const body = request.body;

	const token = getTokenFrom(request);

	//Couldn't figure out why wouldn't it send the error to the errorHandler without next, so I made 
	const decodedToken = getDecodedToken(token);
	if (decodedToken === undefined || !decodedToken.id) {
		return response.status(401).send({ error: "token missing or invalid" });
	}

	const user = await User.findById(decodedToken.id);

	if (!body.content) {
		return response.status(400).json({
			error: "content missing"
		}).catch(error => next(error));
	}

	const note = new Note({
		content: body.content,
		important: body.important || false,
		date: new Date(),
		user: user.id
	});

	const savedNote = await note.save();
	user.notes = user.notes.concat(savedNote._id);
	await user.save();

	response.json(savedNote);
});

notesRouter.put("/:id", (request, response) => {
	Note.findByIdAndUpdate(request.params.id, request.body, { new: true })
		.then((modifiedNote) => {
			response.json(modifiedNote);
		});
});

notesRouter.delete("/:id", (request, response) => {
	const id = request.params.id;
	Note.findByIdAndDelete(id).then(() => {
		response.status(204).end();
	});
});

module.exports = notesRouter;