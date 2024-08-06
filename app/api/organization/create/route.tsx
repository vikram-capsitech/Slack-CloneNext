import { currentUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import { customAlphabet } from "nanoid";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { Readable } from "stream";
import { ScraawlBlob } from "@/helpers/AzureHandler";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    // Parse form data from request
    const formData = await req.formData();
    const otherFormData: Record<string, any> = {};

    // Extract non-file form data
    formData.forEach((value, key) => {
      if (key !== "imageFile") {
        otherFormData[key] = value;
      }
    });

    // Extract the file from form data
    const file = formData.get("imageFile") as any;

    // Check for the current user
    const profile = await currentUser();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Generate a custom ID
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const nanoid = customAlphabet(alphabet, 9);
    const customId = nanoid();

    // Initialize image URL
    let imageUrl = "";

    if (file) {
      // Validate file type
      const allowedFileTypes = ["image/jpeg", "image/png"];
      if (!allowedFileTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "Unsupported file type" },
          { status: 400 }
        );
      }

      // Process file buffer and create a readable stream
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const stream = Readable.from(fileBuffer);
      const streamLength = fileBuffer.length;

      // Upload file to Azure Blob Storage
      const blobName = file.name;
      const picPath = await ScraawlBlob(
        `Organizations/${profile.id}/profile/${blobName}`,
        stream,
        streamLength
      ) as string;

      imageUrl = `${process.env.BLOB_URL}${process.env.CONTAINER_NAME}/${picPath}`;
    }

    // Create a new server record in the database
    const server = await db.server.create({
      data: {
        id: customId,
        profileId: profile.id!,
        name: otherFormData.name,
        imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [{ name: "general", profileId: profile.id! }],
        },
        members: {
          create: [{ profileId: profile.id!, role: MemberRole.ADMIN }],
        },
      },
    });

    return NextResponse.json({
      status: 200,
      server,
      message: "Server created successfully!",
    });
  } catch (error: any) {
    console.error("[SERVERS_POST]", error);
    return NextResponse.json({
      status: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
}
