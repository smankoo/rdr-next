import { NextResponse } from "next/server";
import { getArticleById } from "@/app/lib/articleUtils";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const articleId = params.id;
  try {
    const article = await getArticleById(articleId);
    if (article) {
      return NextResponse.json(article);
    } else {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
