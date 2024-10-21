import mongoose from "mongoose";
import { PollDocument } from "../types";

// schema for poll data
const pollSchema = new mongoose.Schema({
	question: { type: String, required: true },
	options: [
		{
			name: { type: String, required: true },
			votes: { type: Number, default: 0 },
			users: {
				type: Array({
					name: { type: String },
					_id: { type: String },
				}),
				default: [""],
			},
		},
	],
	userID: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
});

// Creating the poll model
export const Poll = mongoose.model("Poll", pollSchema);

//Functions to interact with the Poll Model
export const getPolls = (userId: string) => Poll.find({ userID: userId });
export const getPollsById = (id: string) => Poll.findById(id);
export const createPoll = async (values: Record<string, any>) => {
	return new Poll(values).save().then((poll) => poll.toObject());
};
export const deletePollById = (id: string) =>
	Poll.findOneAndDelete({ _id: id }, { new: true });
export const incrementVote = (
	pollId: string,
	optionName: string,
	userId: string,
	userName: string
) => {
	return Poll.findOneAndUpdate(
		{ _id: pollId, "options.name": optionName }, // Accessing the correct array element
		{
			$inc: { "options.$.votes": 1 }, // Use `$` to update the matched array element
			$push: { "options.$.users": { name: userName, _id: userId } }, // Use `$` to push into the correct array element
		},
		{ new: true }
	);
};
export const decrementVote = async (
	pollId: string,
	optionName: string,
	userId: string,
	userName: string
) => {
	// First, find the poll and get the current votes
	const poll = await Poll.findOne(
		{ _id: pollId, "options.name": optionName },
		{ "options.$": 1 } // Only get the relevant option
	);

	if (!poll || poll.options[0].votes <= 0) {
		return null; // or handle accordingly (e.g., throw an error)
	}

	// Proceed with the update only if votes are greater than zero
	return Poll.findOneAndUpdate(
		{ _id: pollId, "options.name": optionName },
		{
			$inc: { "options.$.votes": -1 },
			$pull: { "options.$.users": { name: userName, _id: userId } },
		},
		{ new: true }
	);
};

export default Poll;
