import { User } from "@/app/types";
import UserClient from "./UserClient";

interface Props {
  params: { username: string };
}

interface Repo {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  html_url: string;
}

export default async function UserPage({ params }: Props) {
  const { username } = params;

  // buscar dados no servidor
  const userRes = await fetch(`https://api.github.com/users/${username}`, {
    next: { revalidate: 60 }, // cache de 1 minuto
  });
  const user: User = await userRes.json();

  const reposRes = await fetch(
    `https://api.github.com/users/${username}/repos`,
    {
      next: { revalidate: 60 },
    }
  );
  const repos: Repo[] = await reposRes.json();

  return <UserClient user={user} repos={repos} />;
}
