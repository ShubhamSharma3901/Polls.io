import { Document } from "mongoose";

interface ServerToClientEvents {
	noArg: () => void;
	basicEmit: (a: number, b: string, c: Buffer) => void;
	withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
	hello: () => void;
}

interface InterServerEvents {
	ping: () => void;
}

interface SocketData {
	name: string;
	age: number;
}

// poll option interface
interface PollOption {
	name: string;
	votes: number;
	users: {
		name: string;
		_id: string;
	}[];
}

// poll document interface
interface PollDocument extends Document {
	question: string;
	options: PollOption[];
	createdAt: Date;
	userID: string;
}

//user document interface
interface UserDocument extends Document {
	username: string;
	email: string;
	authentication: {
		password: string;
		salt: string;
		sessionToken: string;
	};
}

export {
	ServerToClientEvents,
	ClientToServerEvents,
	InterServerEvents,
	SocketData,
	PollOption,
	PollDocument,
	UserDocument,
};
