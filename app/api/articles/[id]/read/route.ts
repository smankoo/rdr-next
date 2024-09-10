import { NextResponse } from "next/server";
import { updateArticleReadStatus } from "../../../../lib/feedUtils";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { isRead } = await request.json();

  try {
    const updatedArticle = await updateArticleReadStatus(id, isRead);
    return NextResponse.json(updatedArticle);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update article read status" }, { status: 500 });
  }
}
