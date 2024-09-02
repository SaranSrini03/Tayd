import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const DataBody = await req.json();

    if (DataBody) {
      const { Content, Title, Subtitle, author, Like, comment } = DataBody;

      if (!Content || !Title || !Subtitle || !author || Like === undefined) {
        return NextResponse.json(
          { message: "fields are empty" },
          { status: 400 }
        );
      }

      await prisma.blog.create({
        data: {
          BlogContent: Content,
          Title: Title,
          SubTitle: Subtitle,
          Author: author,
          Like: Like,
          comments: Comment?.length
            ? {
              create: comment.map((c: any) => ({
                CommentWritter: c.CommentWritter,
                Content: c.Content
              }))
            } :
            undefined,
        },
      });

      return NextResponse.json(
        { message: "Successfully added data" },
        { status: 201 }
      );
    }

    return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
