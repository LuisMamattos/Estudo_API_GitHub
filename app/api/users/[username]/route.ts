import { NextRequest, NextResponse } from "next/server";
import { githubFetch } from "@/app/lib/github-fetch";
import { UserProfileSchema } from "@/app/lib/github-schemas";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  const { username } = await context.params;

  const data = await githubFetch(`https://api.github.com/users/${username}`);

  const parsed = UserProfileSchema.parse(data);
  return NextResponse.json(parsed);
}
