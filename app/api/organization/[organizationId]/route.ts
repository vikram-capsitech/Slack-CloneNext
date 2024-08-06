"use client";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { organizationId: string } }
) {
  try {
    // Check if user is authenticated
    const profile = await currentUser();
    if (!profile) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized: Please log in." }),
        { status: 401 }
      );
    }

    // Fetch the organization by ID
    const organization = await db.server.findFirst({
      where: {
        id: params.organizationId,
        profileId: profile.id,
      },
    });

    // Check if the organization exists and belongs to the user
    if (!organization) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid Organization ID or access denied." }),
        { status: 404 }
      );
    }

    // Return the organization data
    return NextResponse.json({ organization });
  } catch (error) {
    console.error("[ORGANIZATIONS_GET]", error);
    // Return a generic error message for server issues
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error. Please try again later." }),
      { status: 500 }
    );
  }
}
