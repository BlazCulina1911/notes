const bcrypt = require("bcrypt");
const User = require("../models/user");
const app = require("../index");
const supertest = require("supertest");

const api = supertest(app);


describe("Initially one user in db", () => {
	beforeEach(async () => {
		await User.deleteMany({});
		const passwordHash = await bcrypt.hash("test", 10);

		const user = new User({
			username: "Test",
			passwordHash
		});

		await user.save();
	});

	test("creations makes new user", async () => {
		const usersAtStart = await User.find({});
		const newUser = {
			username: "BlazCulina1911",
			name: "Blaž Čulina",
			password: "test",
		};

		await api
			.post("/api/users")
			.send(newUser)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const usersAtEnd = (await User.find({}));
    
		expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

		const usernames = usersAtEnd.map(u => u.username);

		expect(usernames).toContain(newUser.username);

	}, 50000);

	test("creations doesn't duplicate a user", async () => {
		const usersAtStart = await User.find({});

		const newUser = {
			username: "Test",
			name: "Ja Majka",
			password: "slanina",
		};

		const result = await api
			.post("/api/users")
			.send(newUser)
			.expect(400)
			.expect("Content-Type", /application\/json/);

		expect(result.body.error).toContain("username must be unique");

		const usersAtEnd = await User.find({});
		expect(usersAtEnd).toEqual(usersAtStart);
	});
});