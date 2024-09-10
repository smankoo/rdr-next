import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { isRead } = await request.json();
  try {
    const updatedArticle = await prisma.article.update({
      where: { id },
      data: { isRead },
    });

    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error("Error updating article read status:", error);
    return NextResponse.json({ error: "Failed to update article read status" }, { status: 500 });
  }
}
