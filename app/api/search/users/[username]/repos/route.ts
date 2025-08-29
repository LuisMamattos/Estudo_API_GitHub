import { NextResponse } from "next/server";
import { githubFetch } from "@/app/lib/github-fetch";
import { RepoSchema } from "@/app/lib/github-schemas";
import { z } from "zod";

const ReposArraySchema = z.array(RepoSchema);

export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? "1");
  const per_page = Number(searchParams.get("per_page") ?? "30");

  try {
    const data = await githubFetch(
      `https://api.github.com/users/${params.username}/repos?page=${page}&per_page=${per_page}`
    );

    const parsed = ReposArraySchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid GitHub payload", details: parsed.error.format() },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed.data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}
