require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const notesRouter = require("./routes/notes");
const usersRouter = require("./routes/users");
const loginRouter = require("./routes/login");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");

const url = process.env.MONGODB_URI;

logger.info("connection to", url);
mongoose.connect(url)
	.then(() => {
		logger.info("connected to MongoDB");
	})
	.catch((error) => {
		logger.info("error connecting to MongoDB:", error.message);
	});

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);

//This will only be shown if there is no "build" folder present
app.get("/", (req, res) => {
	res.send(`<h1>Hello!</h1>
	<p>Please build the frontend and place the "build" folder in the backend</p>
	<p>If you are not running the app in development mode, a restart is required!</p>`)
		.end();
});

app.use("/api/login", loginRouter);
app.use("/api/users", usersRouter);
app.use("/api/notes", notesRouter);

app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	logger.info(`Server running on port ${PORT}`);
});

module.exports = app;