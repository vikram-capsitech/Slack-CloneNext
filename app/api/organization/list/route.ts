import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" });
    }
    console.log(user);
    const organizations = await db.server.findMany({
      where: {
        members: {
          some: {
            profileId: user?.id,
          },
        },
      },
      include: {
        members: {
          select: {
            role: true,
            profileId: true,
            profile: {
              select: {
                name: true,
                email: true,
                role: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });
    console.log("asasasasasas", organizations);
    if ((await organizations).length === 0) {
      return NextResponse.json({ message: "No organization found!" });
    }

    const response = NextResponse.json({
      message: "Organization fetched successfully",
      items: organizations,
      status: true,
    });

    response.headers.set("Access-Control-Allow-Origin", "*"); // Adjust origin as needed
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS"); // Adjust methods as needed
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    ); // Adjust headers as needed
    return response;
  } catch (err: any) {
    console.log("Organization_Get => ", err);
    return NextResponse.json({ error: err.message });
  }
}
