import { db } from "@/lib/db";
import { NextApiRequest } from "next";
import jwt from "jsonwebtoken";

export const CurrentProfilePages = async (req: NextApiRequest) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new Error("Token missing from headers");
  }
  const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
  
  if (!decodedToken) {
    return null;
  }

  let id = decodedToken.id!;

  const profile = await db.user.findUnique({
    where: {
      id,
    },
  });
  return profile;
};
