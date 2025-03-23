import {UserModel} from "../models/users";
import {Poll} from "../models/polls";
import express from "express";

const getTopPolls = async () => {
    return Poll.aggregate([
        { $unwind: "$options" },
        { $group: { _id: "$_id", totalVotes: { $sum: "$options.votes" }, question: { $first: "$question" } } },
        { $sort: { totalVotes: -1 } },
        { $limit: 5 }
    ]);
};

const getVoteTrends = async () => {
    return Poll.aggregate([
        { $unwind: "$options" },
        { $unwind: "$options.users" },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                votesOnDay: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);
};

export const getTopPollsController = async (req:express.Request, res:express.Response) => {
    try {
        const topPolls = await getTopPolls();
        return res.status(200).json(topPolls).end();
    } catch (e) {
        console.log("Get Top Polls Controller Failed: ", e);
        return res.status(500).json({ error: "Internal Server Error(Couldn't get Top Polls)" }).end();
    }
}

export const getVoteTrendsController = async (req:express.Request, res:express.Response) => {
    try {
        const voteTrends = await getVoteTrends();
        return res.status(200).json(voteTrends).end();
    } catch (e) {
        console.log("Get Top Polls Controller Failed: ", e);
        return res.status(500).json({ error: "Internal Server Error(Couldn't get Vote Trends)" }).end();
    }
}
