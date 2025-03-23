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

const getUserEngagement = async () => {
    return UserModel.aggregate([
      { 
        $lookup: { 
          from: "polls", localField: "_id", foreignField: "userID", as: "userPolls"
        } 
      },
      { 
        $project: {
          username: 1,
          pollsCreated: { $size: "$userPolls" },
          totalVotesCast: {
            $sum: {
              $map: {
                input: "$userPolls",
                as: "poll",
                in: { $sum: "$$poll.options.votes" }
              }
            }
          }
        }
      }
    ]);
  };

const getPopularPollOptions = async () => {
    return Poll.aggregate([
        { $unwind: "$options" },
        { $group: { _id: "$options.name", totalVotes: { $sum: "$options.votes" } } },
        { $sort: { totalVotes: -1 } },
        { $limit: 5 }
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

export const getUserEngagementController = async(req:express.Request, res: express.Response) => {
    try{
        const userEngagement = await getUserEngagement();
        return res.status(200).json(userEngagement).end();
    }
    catch(e){
        console.log("Get User Engagement Controller Failed: ", e);
        return res.status(500).json({ error: "Internal Server Error(Couldn't get Vote Trends)" }).end();
    }
}


export const getPopularPollOptionsController = async (req: express.Request, res: express.Response) => {
    try {
        const popularOptions = await getPopularPollOptions();
        return res.status(200).json(popularOptions).end();
    } catch (e) {
        console.log("Get Popular Poll Options Controller Failed: ", e);
        return res.status(500).json({ error: "Internal Server Error (Couldn't get Popular Poll Options)" }).end();
    }
};

export const getVoteTrendsController = async (req:express.Request, res:express.Response) => {
    try {
        const voteTrends = await getVoteTrends();
        return res.status(200).json(voteTrends).end();
    } catch (e) {
        console.log("Get Top Polls Controller Failed: ", e);
        return res.status(500).json({ error: "Internal Server Error(Couldn't get Vote Trends)" }).end();
    }
}
