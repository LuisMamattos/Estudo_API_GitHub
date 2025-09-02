import { NextResponse } from "next/server";
import { githubFetch } from "@/app/lib/github-fetch";
import { RepoSchema } from "@/app/lib/github-schemas";
import { z } from "zod";

const ReposArraySchema = z.array(RepoSchema);

export async function GET(
  req: Request,
  context: { params: Promise<{ username: string }> }
) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? "1");
  const per_page = Number(searchParams.get("per_page") ?? "30");

  const { username } = await context.params;

  const data = await githubFetch(
    `https://api.github.com/users/${username}/repos?page=${page}&per_page=${per_page}`
  );

  const parsed = ReposArraySchema.parse(data);
  return NextResponse.json(parsed);
}
