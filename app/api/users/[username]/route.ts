import { NextResponse } from "next/server";
import { githubFetch } from "@/app/lib/github-fetch";
import { UserProfileSchema } from "@/app/lib/github-schemas";

export async function GET(
  _req: Request,
  { params }: { params: { username: string } }
) {
  const data = await githubFetch(
    `https://api.github.com/users/${params.username}`
  );
  const parsed = UserProfileSchema.parse(data); //pode ser invalido..
  return NextResponse.json(parsed);
}
