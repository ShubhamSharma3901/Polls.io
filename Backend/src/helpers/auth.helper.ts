import * as crypto from "crypto";

const SECRET = "ENCODINGSECRET";

export const random = () => {
  return crypto.randomBytes(128).toString("base64");
};

export const generateHashPassword = (salt: string, password: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET)
    .digest("hex");
};
