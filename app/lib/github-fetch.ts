export async function githubFetch<T = unknown>(
  url: string,
  init?: RequestInit
) {
  const headers: HeadersInit = {
    "User-Agent": "next-bff",
    Accept: "application/vnd.github+json",
    ...(process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {}),
    ...init?.headers,
  };
  const res = await fetch(url, { ...init, headers, cache: "no-store" });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GitHub ${res.status}: ${body || res.statusText}`);
  }
  return (await res.json()) as T;
}
