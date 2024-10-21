import express from "express";
import { get, merge } from "lodash";
import { getUserBySessionToken } from "../models/users";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const sessionToken = req.cookies["AUTH-TOKEN"];

    if (!sessionToken) {
      return res
        .status(403)
        .json({ error: "Unauthorized [Session Token Not Found]" })
        .end();
    }

    const user = await getUserBySessionToken(sessionToken);

    if (!user) {
      return res
        .status(403)
        .json({ error: "Unauthorized [User Not Found]" })
        .end();
    }

    merge(req, { identity: user });

    return next();
  } catch (e) {
    console.log("Auth Middleware Failed: ", e);
    return res.status(500).json({ error: "Internal Server Error" }).end();
  }
};
