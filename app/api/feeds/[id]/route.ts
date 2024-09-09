import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.article.deleteMany({
      where: { feedId: params.id },
    });

    await prisma.feed.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Feed deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete feed" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { url, name } = await request.json();

  try {
    const updatedFeed = await prisma.feed.update({
      where: { id },
      data: { url, name },
    });

    return NextResponse.json(updatedFeed);
  } catch (error) {
    console.error("Error updating feed:", error);
    return NextResponse.json({ error: "Failed to update feed" }, { status: 500 });
  }
}
