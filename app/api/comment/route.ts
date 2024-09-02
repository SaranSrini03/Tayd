import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const DataBody = await req.json();

    const { content, writter, blogid } = DataBody;
    if (!content || !writter || !blogid) {
      NextResponse.json({ message: "contents are empty" }, { status: 400 });
    }

    await prisma.comment.create({
      data: {
        CommentWritter: writter,
        Content: content,
        BlogId: blogid,
      },
    });

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
