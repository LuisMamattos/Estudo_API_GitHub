import { NextResponse } from "next/server";
import { githubFetch } from "@/app/lib/github-fetch";
import { SearchUsersResponseSchema } from "@/app/lib/github-schemas";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const page = Number(searchParams.get("page") ?? "1");
  const per_page = Number(searchParams.get("per_page") ?? "30");

  const data = await githubFetch(
    `https://api.github.com/search/users?q=${encodeURIComponent(
      q
    )}&page=${page}&per_page=${per_page}`
  );

  const parsed = SearchUsersResponseSchema.parse(data); ////...........

  return NextResponse.json({
    total: parsed.total_count,
    items: parsed.items,
  });
}
