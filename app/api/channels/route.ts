import { MemberRole } from "@prisma/client";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const profile = await currentUser();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);
    
    const serverId = searchParams.get("serverId");

    if (!profile){
        return new NextResponse("Unauthorised" , {status : 401});
    }

    if (!serverId){
        return new NextResponse("Server Id missing" , {status : 400});
    }

    if (name === "general"){
        return new NextResponse("Name cannot be general" , {status : 400});
    }

    const server = await db.server.update({
        where : {
            id : serverId,
            members : {
                some : {
                    profileId : profile.id,
                    role : {
                        in : [MemberRole.ADMIN , MemberRole.MODERATOR]
                    }
                }
            }
        },
        data : {
            channels : {
                create : {
                    profileId : profile.id!,
                    name,
                    type
                }
            }
        }
    });

    return NextResponse.json(server);

} catch (error) {
    console.log("[CHANNELS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
