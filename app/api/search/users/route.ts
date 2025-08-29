import { NextResponse } from "next/server";
import { githubFetch } from "@/app/lib/github-fetch";
import { SearchUsersResponseSchema } from "@/app/lib/github-schemas";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const page = Number(searchParams.get("page") ?? "1");
  const per_page = Number(searchParams.get("per_page") ?? "30");

  if (!q.trim()) {
    return NextResponse.json({ error: "Missing q" }, { status: 400 });
  }

  try {
    const data = await githubFetch(
      `https://api.github.com/search/users?q=${encodeURIComponent(
        q
      )}&page=${page}&per_page=${per_page}`
    );

    const parsed = SearchUsersResponseSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid GitHub payload", details: parsed.error.format() },
        { status: 502 }
      );
    }

    // Sanitizado e conciso para o client
    return NextResponse.json({
      total: parsed.data.total_count,
      items: parsed.data.items,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}
