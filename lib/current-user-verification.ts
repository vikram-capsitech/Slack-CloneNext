import { NextApiRequest } from "next"
import jwt from "jsonwebtoken";
import { db } from "./db";
import { redirect } from "next/navigation";


export const CurrentUserDetail = async(req:NextApiRequest) => {
    try{
        const token = req.headers.authorization?.split(" ")[1];
        console.log("######################",token,req.headers.authorization)
        if(!token){
            console.log("Tokenn is missing from header");
            throw new Error("Token missing from header");
        }
    
        const decodeToken:any = jwt.verify(token,process.env.JWT_SECRET!)
    
        if(!decodeToken){
            return null;
        }

        let id = decodeToken.id!;

  const profile = await db.user.findUnique({
    where: {
      id,
    },
  });
  return profile;

    }catch(error:any){
        if (error?.name === 'TokenExpiredError') {
            // Redirect to /login if the token is expired
            redirect('/login')
        } else {
            // Log the error and throw it
            console.error("Error verifying token:", error);
            throw error;
        }
    }

}