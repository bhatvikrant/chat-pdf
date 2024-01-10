import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { loadS3IntoPinecone } from "~/lib/pinecone";
import { getS3Url } from "~/lib/s3";
import { db } from "~/server/db";
import { chats } from "~/server/db/schema";

export async function POST(req: Request, res: Response) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await req.json()) as { file_key: string; file_name: string };
    const { file_key, file_name } = body;
    console.log({ file_key, file_name });

    await loadS3IntoPinecone(file_key);

    const chat_id = await db
      .insert(chats)
      .values({
        fileKey: file_key,
        pdfName: file_name,
        pdfUrl: getS3Url(file_key),
        userId,
      })
      .returning({
        instertedId: chats.id,
      });

    return NextResponse.json(
      { chat_id: chat_id[0]?.instertedId },
      { status: 200 },
    );
  } catch (error) {
    console.log("error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
