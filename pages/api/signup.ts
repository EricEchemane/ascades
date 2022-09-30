import { NextApiRequest } from "next";
import connectToDatabase from "../../db/connectToDatabase";
import normalize, { RequestError } from "../../utils/response-normalizer";

async function handler(req: NextApiRequest) {
    if (req.method !== "POST") throw new RequestError(405, "Method not allowed");
    const db = await connectToDatabase();
    if (!db) throw new RequestError(500, "Internal server error");
    const { User } = db.models;
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) throw new RequestError(409, "User already exists");

    const user = new User(req.body);
    await user.save();
    return user;
}

export default normalize(handler, { protect: false });