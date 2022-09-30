import { NextApiRequest } from "next";
import { JWT } from "next-auth/jwt";
import connectToDatabase from "../../db/connectToDatabase";
import normalize, { RequestError } from "../../utils/response-normalizer";

async function handler(req: NextApiRequest, token: JWT) {
    if (req.method !== "GET") throw new RequestError(405, "Method not allowed");
    const db = await connectToDatabase();
    if (!db) throw new RequestError(500, "Internal server error");
    const { User } = db.models;
    const user = await User.findOne({ email: token.email });
    if (!user) throw new RequestError(404, "User not found");
    return user;
}

export default normalize(handler);