
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server"


export async function GET (req:NextApiRequest) {
    try{
        const user = await currentUser()

        if(!user){
            return NextResponse.json({ message: "Unauthorized" });
        }
        console.log(user);
        const organizations = await db.server.findMany({
            where:{
                members:{
                    some:{
                        profileId: user?.id
                    }
                }
            },
            include:{
                members:true
            }
        });
        console.log("asasasasasas",organizations)
        if((await organizations).length === 0){
           return NextResponse.json({message:"No organization found!"})
        }

        return NextResponse.json({
            message:"Organization fetched succefully",
            items:organizations,
            status:true
        })

    }catch (err:any){
        console.log("Organization_Get => ",err)
        return NextResponse.json({ error: err.message });
    }
}