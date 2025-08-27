"use client";

import { useState, useEffect } from "react";
import { User, Repo } from "@/app/types";
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
import Favoritos from "@/app/favoritosComp";

interface Props {
  user: User;
  repos: Repo[];
}

export default function UserClient({ user, repos }: Props) {
  // Inicializa o estado com localStorage apenas uma vez
  const [favoriteUsers, setFavoriteUsers] = useState<User[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("favoriteUsers");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  // Sincroniza o localStorage sempre que favoriteUsers mudar
  useEffect(() => {
    localStorage.setItem("favoriteUsers", JSON.stringify(favoriteUsers));
  }, [favoriteUsers]);

  function toggleFavorite(user: User) {
    const isFav = favoriteUsers.some((fav) => fav.login === user.login);
    setFavoriteUsers(
      isFav
        ? favoriteUsers.filter((fav) => fav.login !== user.login)
        : [...favoriteUsers, user]
    );
  }

  // Inicializa o estado com localStorage apenas uma vez
  const [favoriteRepos, setFavoriteRepos] = useState<Repo[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("favoriteRepos");
      return stored ? JSON.parse(stored) : repos;
    }
    return repos;
  });

  // Sincroniza o localStorage sempre que favoriteRepos mudar
  useEffect(() => {
    localStorage.setItem("favoriteRepos", JSON.stringify(favoriteRepos));
  }, [favoriteRepos]);

  // Alterna favorito
  function toggleFavoriteR(repo: Repo) {
    const isFav = favoriteRepos.some((fav) => fav.id === repo.id);
    setFavoriteRepos(
      isFav
        ? favoriteRepos.filter((fav) => fav.id !== repo.id)
        : [...favoriteRepos, repo]
    );
  }

  return (
    <div
      className="fixed top-0 left-0 flex flex-col w-full h-full space-y-6"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundImage: `url(${fundo.src})`,
      }}
    >
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <Button variant="link" asChild>
          <Link href="/">
            <ArrowLeftIcon className="size-7 text-amber-50 fill-current" />
          </Link>
        </Button>
        <h2 className="text-xl font-bold text-amber-50 ml-80">
          Repositórios(arrumar alinhamento)
        </h2>
        <div className="text-xl font-bold text-amber-50 mr-22">Favoritos</div>
      </div>

      <div className="flex flex-row gap-6 justify-between">
        {/* Coluna 1: Card com usuário */}
        <div className="flex-1 ml-8">
          <Card
            className="w-full"
            style={{
              backgroundSize: "cover",
              backgroundImage: `url(${fundodiv.src})`,
            }}
          >
            <CardHeader className="flex flex-col items-center text-center gap-4 w-full">
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

              <div className="w-full space-y-1 text-left font-semibold">
                <p className="flex items-center gap-1 italic truncate">
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
                {user.html_url && (
                  <Button className="!px-0" variant="link" asChild>
                    <Link
                      className="truncate"
                      href={user.html_url}
                      target="_blank"
                    >
                      <Github /> Ver no GitHub
                    </Link>
                  </Button>
                )}
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Coluna 2: Repos */}
        <div className="flex-1 grid gap-3 font-semibold h-[800px] overflow-y-auto">
          {repos.map((repo) => (
            <Card
              key={repo.id}
              style={{
                backgroundSize: "cover",
                backgroundImage: `url(${fundodiv2.src})`,
              }}
            >
              <CardHeader className="flex justify-between items-center">
                <Link
                  href={repo.html_url}
                  target="_blank"
                  className="font-medium text-primary truncate"
                >
                  {repo.name}
                </Link>

                {/* Botão de favoritar */}
                <button
                  onClick={() => toggleFavoriteR(repo)}
                  className="p-1 hover:text-yellow-500"
                >
                  <Star
                    className={`w-5 h-5 ${
                      favoriteRepos.some((fav) => fav.id === repo.id)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-400"
                    }`}
                  />
                </button>
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

        {/* Coluna 3: Favoritos */}
        <div className=" ">
          <Favoritos
            favoriteRepos={favoriteRepos}
            toggleFavoriteR={toggleFavoriteR}
            favoriteUsers={favoriteUsers}
            toggleFavorite={toggleFavorite}
          />
        </div>
      </div>
    </div>
  );
}
