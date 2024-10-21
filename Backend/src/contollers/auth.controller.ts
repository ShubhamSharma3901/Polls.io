import express from "express";
import {
	createUser,
	getUserByEmail,
	getUserBySessionToken,
} from "../models/users";
import { generateHashPassword, random } from "../helpers/auth.helper";

//Register a new User
export const registerUser = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { username, email, password } = req.body;

		//Check if the user already exists
		const isExisting = await getUserByEmail(email);

		if (isExisting) {
			return res.status(400).json({ error: "User already exists" }).end();
		}

		// If it's a new user then encrypt the password
		const salt = random();
		const encryptedPassword = generateHashPassword(salt, password);

		// And Now Save user to database
		const user = await createUser({
			username,
			email,
			authentication: {
				password: encryptedPassword,
				salt,
			},
		});

		return res.status(201).json({ message: "Registration successfull" }).end();
	} catch (e) {
		console.log("Register User Controller Failed: ", e);
	}
};

//Login a User
export const loginUser = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const { email, password } = req.body;

		console.log("body: ", req.body);

		//Check if the user already exists
		const user = await getUserByEmail(email).select(
			"+authentication.password +authentication.salt"
		);

		if (!user) {
			return res.status(400).json({ error: "User does not exist" }).end();
		}

		// If it's a new user then encrypt the password
		const expectedPassword = generateHashPassword(
			user.authentication!.salt!,
			password
		);

		if (user.authentication!.password !== expectedPassword) {
			return res.status(400).json({ error: "Invalid Password" }).end();
		}

		//Generate Session Token
		const salt = random();
		//Update User with Session Token
		user.authentication!.sessionToken = generateHashPassword(
			salt,
			user._id.toString()
		);
		await user.save();

		//Save Session Token in Cookie
		res.cookie("AUTH-TOKEN", user.authentication!.sessionToken, {
			expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
			httpOnly: true,
			sameSite: "lax",
		});

		return res.status(200).json({ message: "user logged in" }).end();
	} catch (e) {
		console.log("Login User Controller Failed: ", e);
	}
};

export const getUser = async (req: express.Request, res: express.Response) => {
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

		return res
			.status(200)
			.json({ message: "User Retrieved", user: user })
			.end();
	} catch (e) {
		console.log("getUser Failed: ", e);
		return res
			.status(500)
			.json({ error: "Internal Server Error[CANNOT GET USER]" })
			.end();
	}
};

export const logoutUser = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const sessionToken = req.cookies["AUTH-TOKEN"];

		if (!sessionToken) {
			return res
				.status(403)
				.json({ error: "Unauthorized [Session Token Not Found]" })
				.end();
		}

		res.clearCookie("AUTH-TOKEN", {
			httpOnly: true,
			expires: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
			sameSite: "lax",
		});

		return res.status(200).json({ message: "User Logged Out" }).end();
	} catch (e) {
		console.log("getUser Failed: ", e);
		return res
			.status(500)
			.json({ error: "Internal Server Error[CANNOT GET USER]" })
			.end();
	}
};
