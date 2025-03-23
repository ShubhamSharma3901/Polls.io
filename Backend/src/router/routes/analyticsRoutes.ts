import express from "express";
import { getTopPollsController, getVoteTrendsController, getPopularPollOptionsController, getUserEngagementController } from "../../contollers/analytics.controller";

export default (router: express.Router) => {
    router.get("/top-polls", (req:express.Request, res:express.Response) => {
        getTopPollsController(req,res);
    });
    router.get("/vote-trends", (req:express.Request, res:express.Response) => {
        getVoteTrendsController(req,res);
    });
    router.get("/user-engagement",(req:express.Request, res:express.Response)=>{
        getUserEngagementController(req,res);
    });
    router.get("/popular-options", (req: express.Request, res: express.Response) => {
        getPopularPollOptionsController(req, res);
    });
};