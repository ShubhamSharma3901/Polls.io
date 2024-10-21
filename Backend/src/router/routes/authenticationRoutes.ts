import {
	getUser,
	loginUser,
	logoutUser,
	registerUser,
} from "../../contollers/auth.controller";
import express from "express";

export default (router: express.Router) => {
	router.post("/auth/register", (req, res) => {
		registerUser(req, res);
	});
	router.post("/auth/login", (req, res) => {
		loginUser(req, res);
	});
	router.get("/auth/user", (req, res) => {
		getUser(req, res);
	});
	router.get("/auth/logout", (req, res) => {
		logoutUser(req, res);
	});
};
