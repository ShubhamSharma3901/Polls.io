import express from "express";
import {
	createPoll,
	deletePollById,
	getPolls,
	getPollsById,
} from "../models/polls";
import { PollDocument } from "../types";

export const getAllPolls = async (
	req: express.Request,
	res: express.Response,
	userId: string
) => {
	try {
		const allPolls = await getPolls(userId);
		console.log(userId);
		return res.status(200).json(allPolls).end();
	} catch (e) {
		console.log("Get All Polls Controller Failed: ", e);
	}
};

export const deletePoll = async (
	req: express.Request,
	res: express.Response,
	id: string
) => {
	try {
		if (!id)
			return res
				.status(401)
				.json({ error: "ID is required to know the poll!" })
				.end();
		const poll = await deletePollById(id);
		return res.status(200).json(poll).end();
	} catch (e) {
		console.log("Delete Poll Controller Failed: ", e);
	}
};

export const getPoll = async (
	req: express.Request,
	res: express.Response,
	id: string
) => {
	try {
		if (!id)
			return res
				.status(401)
				.json({ error: "ID is required to know the poll!" })
				.end();
		const poll = await getPollsById(id);
		return res.status(200).json(poll).end();
	} catch (e) {
		console.log("Get Poll Controller Failed: ", e);
	}
};

export const createPollCtrl = async (
	req: express.Request,
	res: express.Response
) => {
	const { question, options }: PollDocument = req.body;
	// @ts-ignore
	const userID = req.identity._id.toString();
	// @ts-ignore
	const userName = req.identity.username;
	console.log(userName);
	try {
		const newPoll = await createPoll({
			question,
			options,
			users: {
				name: userName,
				_id: userID,
			},
			userID,
		});
		return res.status(200).json(newPoll).end();
	} catch (e) {
		console.log("Get All Polls Controller Failed: ", e);
	}
};
