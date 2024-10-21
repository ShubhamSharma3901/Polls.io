import express from "express";
import {
	createPollCtrl,
	deletePoll,
	getAllPolls,
	getPoll,
} from "../../contollers/polls.controller";
import { identity } from "lodash";

export default (router: express.Router) => {
	router.post("/polls", (req, res) => {
		createPollCtrl(req, res);
	});
	router.get("/polls", (req, res) => {
		// @ts-ignore
		const userId = req.identity._id.toString();

		getAllPolls(req, res, userId);
	});
	router.get("/polls/:id", (req, res) => {
		const { id } = req.params;
		getPoll(req, res, id);
	});
	router.delete("/polls/:id", (req, res) => {
		const { id } = req.params;
		deletePoll(req, res, id);
	});
};
