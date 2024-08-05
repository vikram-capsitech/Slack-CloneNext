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
    const formData = await req.formData();

    console.log("FILEDATA",(req as any).file)

    console.log("******************************************************",formData);
    const otherFormData: any = {};
    if (formData) {
      formData.forEach((val, key) => {
        if (key != "imageFile") otherFormData[key] = val;
      });
    }

    const file = formData.get("imageFile") as File;

    const profile = await currentUser();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let nanoid = customAlphabet(alphabet, 9);
    const customId = nanoid();

    let imageUrl = "";
    console.log("####################################################");
    if (file) {
        console.log("******************************************************",file);
      const allowedFileTypes = ["image/jpeg", "image/png"];
      if (!allowedFileTypes.includes(file?.type))
        return NextResponse.json(
          { error: "Unsupported file type" },
          { status: 400 }
        );
      console.log("******************************************************");
      console.log(file?.name);
      const blobName = file?.name;
      const stream = file.stream();
      console.log(stream,"ASDAKSDJHASKDJHKASJHKASJKAJSDH")
      const streamLength = file.size;
      var picPath = (await ScraawlBlob(
        `Organizations/${profile.id}/profile/${blobName}`,
        stream,
        streamLength
      )) as string;

      imageUrl = `${process.env.BLOB_URL}${process.env.CONTAINER_NAME}/${picPath}`;
      console.log("******************************************************");
    }
    console.log("####################################################");

    const server = await db.server.create({
      data: {
        id: customId,
        profileId: profile.id,
        name: otherFormData.name,
        imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [{ name: "general", profileId: profile.id! }],
        },
        members: {
          create: [{ profileId: profile.id!, role: MemberRole.ADMIN }],
        },
      } as any,
    });

    return NextResponse.json({
      status: 200,
      data: server,
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
