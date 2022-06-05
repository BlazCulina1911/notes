require("dotenv").config();
const express = require("express");
const Note = require("./models/note");
const cors = require("cors");
const app = express();

app.use(express.static("build"));
app.use(express.json());
app.use(cors());

//This will only be shown if there is no "build" folder present
app.get("/", (req, res) => {
	res.send(`<h1>Hello!</h1>
	<p>Please build the frontend and place the "build" folder in the backend</p>
	<p>If you are not running the app in development mode, a restart is required!</p>`)
		.end();
});

app.get("/api/notes", (request, response) => {
	Note.find({}).then((notes) => {
		response.json(notes);
	});
});

app.get("/api/notes/:id", (request, response) => {
	Note.findById(request.params.id).then(note => {
		response.json(note);
	});
});

app.post("/api/notes", (request, response, next) => {
	const body = request.body;

	if (!body.content) {
		return response.status(400).json({
			error: "content missing"
		}).catch(error => next(error));
	}

	const note = new Note({
		content: body.content,
		important: body.important || false,
		date: new Date(),
	});

	note.save().then(savedNote => {
		response.json(savedNote);
	}).catch(error => next(error));
});

app.put("/api/notes/:id", (request, response) => {
	Note.findByIdAndUpdate(request.params.id, request.body, {new: true})
		.then((modifiedNote) => {
			response.json(modifiedNote);
		});
});

app.delete("/api/notes/:id", (request, response) => {
	const id = request.params.id;
	Note.findByIdAndDelete(id).then(() => {
		response.status(204).end();
	});
});

//Manual error handler

const errorHandler = (error, req, res, next) => {
	console.log(error.message);

	if(error.name === "CastError"){
		return res.status(400).send({error: "malformatted id"});
	}
	if(error.name === "ValidationError"){
		return res.status(400).send({error: error.message});
	}

	next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});