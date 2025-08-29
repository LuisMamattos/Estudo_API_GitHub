import { NextResponse } from "next/server";
import { githubFetch } from "@/app/lib/github-fetch";
import { UserProfileSchema } from "@/app/lib/github-schemas";

export async function GET(
  _req: Request,
  { params }: { params: { username: string } }
) {
  try {
    const data = await githubFetch(
      `https://api.github.com/users/${params.username}`
    );
    const parsed = UserProfileSchema.safeParse(data);
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
