import { Server } from "socket.io";
import mongoose from "mongoose";
import { authRouter } from "./router/auth.router";
import {analyticsRouter} from "./router/analytics.router";
import { isAuthenticated } from "./middlewares/auth.middleware";
import cookieParser from "cookie-parser";
import { pollsRouter } from "./router/polls.router";
import { decrementVote, getPollsById, incrementVote } from "./models/polls";
import bodyParser from "body-parser";
const cors = require("cors");
const dotenv = require("dotenv");

// Initialize Express and HTTP index
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

//Global Middlewares
app.use(cors({ origin: "http://localhost:8080", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
dotenv.config();

//Routes
app.use("/", authRouter());
app.use("/", analyticsRouter());
app.use("/", isAuthenticated, pollsRouter());

// Connect to MongoDB
mongoose
	.connect(process.env.DATABASE_URL as string)
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((error) => {
		console.log("Error connecting to MongoDB: ", error);
	});

// Socket.io Handling
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	console.log("User connected: ", socket.id);
	socket.on("disconnect", () => {
		console.log("A user disconnected:", socket.id);
	});
});

app.post("/polls/vote/:id", isAuthenticated, async (req: any, res: any) => {
	const pollId = req.params.id;
	const { option } = req.body;

	try {
		const poll = await getPollsById(pollId);
		if (!poll) return res.status(404).json({ error: "Poll not found" });

		const pollOption = poll.options.find((opt) => opt.name === option);

		// let previousOption = poll.options.find((opt) =>
		// 	opt.users.includes(req.identity._id)
		// );
		const user = {
			name: req.identity.username,
			_id: req.identity._id,
		};

		let previousOption;

		for (let i = 0; i < poll.options.length; i++) {
			let option = poll.options[i];

			// Check if the current option's users array contains the user ID
			for (let j = 0; j < option.users.length; j++) {
				if (String(option.users[j]._id) === String(req.identity._id)) {
					previousOption = option; // Store the option that the user previously voted for
					break; // Exit the inner loop once the user is found
				}
			}

			if (previousOption) break; // Exit the outer loop if we found the previous vote
		}

		if (pollOption) {
			let updatedPoll;
			if (previousOption) {
				if (previousOption.name !== option) {
					updatedPoll = await decrementVote(
						pollId,
						previousOption.name,
						req.identity._id,
						req.identity.username
					);
					updatedPoll = await incrementVote(
						pollId,
						option,
						req.identity._id,
						req.identity.username
					);
				} else {
					return res
						.status(400)
						.json({ error: "You have already voted for this option" });
				}
			} else {
				updatedPoll = await incrementVote(
					pollId,
					option,
					req.identity._id,
					req.identity.username
				);
			}

			// Emit the updated poll to all connected clients
			io.emit("pollUpdated", updatedPoll);
			res.status(200).json(poll);
		} else {
			res.status(404).json({ error: "Option not found" });
		}
	} catch (error) {
		console.log("Error voting on poll: ", error);
		res.status(500).json({ error: "Error voting on poll" });
	}
});

server.listen(3000, () => {
	console.log("Server running on port 3000");
});
