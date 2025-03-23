import express from "express";
import { getTopPollsController, getVoteTrendsController } from "../../contollers/analytics.controller";

export default (router: express.Router) => {
    router.get("/top-polls", (req:express.Request, res:express.Response) => {
        getTopPollsController(req,res);
    });
    router.get("/vote-trends", (req:express.Request, res:express.Response) => {
        getVoteTrendsController(req,res);
    });
};