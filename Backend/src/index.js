"use strict";
var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
				  });
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
var __generator =
	(this && this.__generator) ||
	function (thisArg, body) {
		var _ = {
				label: 0,
				sent: function () {
					if (t[0] & 1) throw t[1];
					return t[1];
				},
				trys: [],
				ops: [],
			},
			f,
			y,
			t,
			g;
		return (
			(g = { next: verb(0), throw: verb(1), return: verb(2) }),
			typeof Symbol === "function" &&
				(g[Symbol.iterator] = function () {
					return this;
				}),
			g
		);
		function verb(n) {
			return function (v) {
				return step([n, v]);
			};
		}
		function step(op) {
			if (f) throw new TypeError("Generator is already executing.");
			while ((g && ((g = 0), op[0] && (_ = 0)), _))
				try {
					if (
						((f = 1),
						y &&
							(t =
								op[0] & 2
									? y["return"]
									: op[0]
									? y["throw"] || ((t = y["return"]) && t.call(y), 0)
									: y.next) &&
							!(t = t.call(y, op[1])).done)
					)
						return t;
					if (((y = 0), t)) op = [op[0] & 2, t.value];
					switch (op[0]) {
						case 0:
						case 1:
							t = op;
							break;
						case 4:
							_.label++;
							return { value: op[1], done: false };
						case 5:
							_.label++;
							y = op[1];
							op = [0];
							continue;
						case 7:
							op = _.ops.pop();
							_.trys.pop();
							continue;
						default:
							if (
								!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
								(op[0] === 6 || op[0] === 2)
							) {
								_ = 0;
								continue;
							}
							if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
								_.label = op[1];
								break;
							}
							if (op[0] === 6 && _.label < t[1]) {
								_.label = t[1];
								t = op;
								break;
							}
							if (t && _.label < t[2]) {
								_.label = t[2];
								_.ops.push(op);
								break;
							}
							if (t[2]) _.ops.pop();
							_.trys.pop();
							continue;
					}
					op = body.call(thisArg, _);
				} catch (e) {
					op = [6, e];
					y = 0;
				} finally {
					f = t = 0;
				}
			if (op[0] & 5) throw op[1];
			return { value: op[0] ? op[1] : void 0, done: true };
		}
	};
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = require("socket.io");
var mongoose_1 = require("mongoose");
var polls_1 = require("./models/polls");
var cors = require("cors");
var path = require("path");
// Initialize Express and HTTP index
var http = require("http");
var express = require("express");
var app = express();
var server = http.createServer(app);
app.use(cors());
app.use(express.json());
// Connect to MongoDB
mongoose_1.default
	.connect(
		"mongodb+srv://shubham3901:Dkpmhnnmh%40007@cluster0.mbslhws.mongodb.net/miniproject"
	)
	.then(function () {
		console.log("Connected to MongoDB");
	})
	.catch(function (error) {
		console.log("Error connecting to MongoDB: ", error);
	});
// Socket.io Handling
var io = new socket_io_1.Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});
io.on("connection", function (socket) {
	console.log("User connected: ", socket.id);
	socket.on("disconnect", function () {
		console.log("A user disconnected:", socket.id);
	});
});
//Express Server Handling
app.post("/polls", function (req, res) {
	return __awaiter(void 0, void 0, void 0, function () {
		var _a, question, options, newPoll, error_1;
		return __generator(this, function (_b) {
			switch (_b.label) {
				case 0:
					(_a = req.body), (question = _a.question), (options = _a.options);
					_b.label = 1;
				case 1:
					_b.trys.push([1, 3, , 4]);
					newPoll = new polls_1.default({
						question: question,
						options: options.map(function (option) {
							return { name: option, votes: 0 };
						}),
					});
					return [4 /*yield*/, newPoll.save()];
				case 2:
					_b.sent();
					res.status(201).json(newPoll);
					return [3 /*break*/, 4];
				case 3:
					error_1 = _b.sent();
					res.status(500).json({ error: "Error creating poll" });
					return [3 /*break*/, 4];
				case 4:
					return [2 /*return*/];
			}
		});
	});
});
app.get("/polls", function (req, res) {
	return __awaiter(void 0, void 0, void 0, function () {
		var polls, error_2;
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					_a.trys.push([0, 2, , 3]);
					return [4 /*yield*/, polls_1.default.find()];
				case 1:
					polls = _a.sent();
					res.status(200).json(polls);
					return [3 /*break*/, 3];
				case 2:
					error_2 = _a.sent();
					res.status(500).json({ error: "Error fetching polls" });
					return [3 /*break*/, 3];
				case 3:
					return [2 /*return*/];
			}
		});
	});
});
app.post("/polls/:id/vote", function (req, res) {
	return __awaiter(void 0, void 0, void 0, function () {
		var pollId, option, poll, pollOption, error_3;
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					pollId = req.params.id;
					option = req.body.option;
					_a.label = 1;
				case 1:
					_a.trys.push([1, 6, , 7]);
					return [4 /*yield*/, polls_1.default.findById(pollId)];
				case 2:
					poll = _a.sent();
					if (!poll)
						return [
							2 /*return*/,
							res.status(404).json({ error: "Poll not found" }),
						];
					pollOption = poll.options.find(function (opt) {
						return opt.name === option;
					});
					if (!pollOption) return [3 /*break*/, 4];
					pollOption.votes += 1;
					return [4 /*yield*/, poll.save()];
				case 3:
					_a.sent();
					// Emit the updated poll to all connected clients
					io.emit("pollUpdated", poll);
					res.status(200).json(poll);
					return [3 /*break*/, 5];
				case 4:
					res.status(404).json({ error: "Option not found" });
					_a.label = 5;
				case 5:
					return [3 /*break*/, 7];
				case 6:
					error_3 = _a.sent();
					res.status(500).json({ error: "Error voting on poll" });
					return [3 /*break*/, 7];
				case 7:
					return [2 /*return*/];
			}
		});
	});
});
// app.get("/", async (req:any, res:any) => {
//     try {
//         return res.sendFile(path.join(__dirname, "../public/index.html"));
//     } catch (error) {
//         res.status(500).json({ error: "Error fetching polls" });
//     }
// });
server.listen(3000, function () {
	console.log("Server running on port 3000");
});
