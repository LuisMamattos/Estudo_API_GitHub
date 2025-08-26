/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AtSignIcon,
  Github,
  MapPin,
  ArrowLeftIcon,
  Star,
  Utensils,
  Code,
} from "lucide-react";
import fundodiv2 from "@/images/fundo4.avif";
import fundodiv from "@/images/fundo3.avif";
import fundo from "@/images/fundo2.jpg";
import Link from "next/link";

interface Props {
  params: { username: string };
}

export default async function UserPage({ params }: Props) {
  const { username } = params;

  const userRes = await fetch(`https://api.github.com/users/${username}`);
  const user = await userRes.json();

  const reposRes = await fetch(
    `https://api.github.com/users/${username}/repos`
  );
  const repos = await reposRes.json();

  return (
    <div
      className="fixed top-0 left-0 flex flex-col w-full h-full space-y-6"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundImage: `url(${fundo.src})`,
      }}
    >
      <div className="flex items-center justify-between">
        <Button variant="link" asChild>
          <Link href="/">
            <ArrowLeftIcon className="size-7 text-amber-50 fill-current" />
          </Link>
        </Button>
        <h2 className="text-xl font-bold text-amber-50">Repositórios</h2>
        <div />
      </div>
      {/* botão em cima */}
      <div className="flex flex-row gap-6">
        {/* Coluna 1: Card */}
        <div className="flex-1 ml-8">
          <Card
            className="w-full"
            style={{
              backgroundSize: "cover",
              backgroundImage: `url(${fundodiv.src})`,
            }}
          >
            <CardHeader className="flex flex-col items-center text-center gap-4 w-full">
              {/* Avatar + Nome */}
              <div className="flex flex-col items-center text-center w-full">
                <Avatar className="w-full h-full">
                  <AvatarImage src={user.avatar_url} alt={user.login} />
                  <AvatarFallback>
                    {user.login.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-[clamp(1rem,3vw,32rem)] font-bold break-words">
                  {user.name || user.login}
                </CardTitle>
              </div>

              {/* Info alinhada à esquerda */}
              <div className="w-full space-y-1 text-left font-semibold">
                <p className="flex items-center gap-1  italic truncate ">
                  <AtSignIcon className="size-3 shrink-0" />
                  {user.login}
                </p>
                {user.bio && <p>{user.bio}</p>}
                {user.email && <p>{user.email}</p>}
                {user.location && (
                  <p className="flex items-center gap-1 truncate">
                    <MapPin className="size-3 shrink-0" />
                    {user.location}
                  </p>
                )}
                <Button className="!px-0" variant="link" asChild>
                  <Link
                    className="truncate"
                    href={user.html_url}
                    target="_blank"
                  >
                    <Github /> Ver no GitHub
                  </Link>
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>
        {/* Coluna 2: Repos */}
        <div className="flex-1 grid gap-3 font-semibold">
          {repos.map((repo: any) => (
            <Card
              key={repo.id}
              style={{
                backgroundSize: "cover",
                backgroundImage: `url(${fundodiv2.src})`,
              }}
            >
              <CardHeader className="text-center items-center">
                <a
                  href={repo.html_url}
                  target="_blank"
                  className="font-medium text-primary truncate"
                >
                  {repo.name}
                </a>
              </CardHeader>
              <CardDescription className="text-center items-center">
                <p className="text-muted-foreground">{repo.description}</p>
              </CardDescription>
              <CardContent className="flex justify-between">
                <p className="text-sm flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <Star className="size-3" /> {repo.stargazers_count}
                  </span>
                  |
                  <span className="flex items-center gap-1">
                    <Utensils className="size-3" /> {repo.forks_count}
                  </span>
                </p>
                {repo.language && (
                  <span className="text-sm text-amber-700 flex items-center gap-1 truncate">
                    <Code className="size-3" /> {repo.language}
                  </span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Coluna 3: vazia */}
        <div className="w-24 flex-1"></div>
      </div>
    </div>
  );
}
