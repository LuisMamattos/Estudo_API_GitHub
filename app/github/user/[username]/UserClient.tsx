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
import Link from "next/link";
import Favoritos from "@/app/favoritosComp";
import PaginationControls from "@/app/PaginationControls";

interface Props {
  user: User;
  repos: Repo[];
}

export default function UserClient({ user }: { user: User }) {
  const [repos, setRepos] = useState<Repo[]>([]);

  const [page, setPage] = useState(1);
  const perPage = 30;

  useEffect(() => {
    async function fetchRepos() {
      const res = await fetch(
        `https://api.github.com/users/${user.login}/repos?page=${page}&per_page=${perPage}`
      );
      const data = await res.json();
      setRepos(data);
    }
    fetchRepos();
  }, [user.login, page]);
  //////////////////////////////////////////////////////////////////////////////
  const [favoriteUsers, setFavoriteUsers] = useState<User[]>([]);
  const [mounted, setMounted] = useState(false);

  // Carrega só no client
  useEffect(() => {
    const stored = localStorage.getItem("favoriteUsers");
    if (stored) setFavoriteUsers(JSON.parse(stored));
    setMounted(true);
  }, []);

  // Sempre salva quando mudar
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("favoriteUsers", JSON.stringify(favoriteUsers));
    }
  }, [favoriteUsers, mounted]);
  //////////////////////////////////////////////////////////////////////////////
  function toggleFavorite(user: User) {
    const isFav = favoriteUsers.some((fav) => fav.login === user.login);
    setFavoriteUsers(
      isFav
        ? favoriteUsers.filter((fav) => fav.login !== user.login)
        : [...favoriteUsers, user]
    );
  }

  // Inicializa o estado com localStorage apenas uma vez
  //////////////////////////////////////////////////////////////////////////////

  const [favoriteRepos, setFavoriteRepos] = useState<Repo[]>([]);
  const [mountedR, setMountedR] = useState(false);

  // Executa só no client
  useEffect(() => {
    const stored = localStorage.getItem("favoriteRepos");
    if (stored) setFavoriteRepos(JSON.parse(stored));
    setMountedR(true); // indica que já carregou do client
  }, []);

  // Sempre salva no localStorage quando mudar
  useEffect(() => {
    if (mountedR) {
      localStorage.setItem("favoriteRepos", JSON.stringify(favoriteRepos));
    }
  }, [favoriteRepos, mountedR]);
  /////////////////////////////////////////////////////////////////////////////

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
      className="fixed top-0 left-0 flex flex-col w-full h-full"
      style={{
        backgroundSize: "cover",
        backgroundImage: `url("/images/fundoReuniao2.jpg")`,
      }}
    >
      {/* Cabeçalho */}
      <div className=" p-0 m-0 flex items-center justify-between">
        <Button variant="link" asChild>
          <Link href="/">
            <ArrowLeftIcon className="size-7 fill-current" />
          </Link>
        </Button>
      </div>

      <div className="flex flex-row gap-1 justify-between p-3">
        {/* Coluna 1: Card com usuário */}
        <div className="flex flex-col w-full max-w-xl min-w-50 items-center">
          <div className="text-xl font-bold ">Perfil</div>
          <div className="flex-1 w-full ">
            <Card
              style={{
                backgroundSize: "cover",
                backgroundImage: `url("/images/fundoReuniao5.jpg")`,
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
                  <CardTitle className="text-[clamp(1rem,2vw,10rem)] font-bold break-words">
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
        </div>

        {/* Coluna 2: Repos */}
        <div className="flex flex-col w-full items-center">
          <div className="text-xl font-bold ">Repositórios</div>

          <div className="grid gap-1 font-semibold h-[720px] w-full overflow-y-auto">
            {repos.map((repo) => (
              <Card
                key={repo.id}
                style={{
                  backgroundSize: "cover",
                  backgroundImage: `url("/images/fundoReuniao6.avif")`,
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
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => toggleFavoriteR(repo)}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        favoriteRepos.some((fav) => fav.id === repo.id)
                          ? "fill-yellow-400 text-yellow-400"
                          : ""
                      }`}
                    />
                  </Button>
                </CardHeader>

                <CardDescription className="text-center items-center">
                  <p className="text-muted-foreground">{repo.description}</p>
                </CardDescription>

                <CardContent className="flex justify-between">
                  <p className="text-sm flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Star className="size-3" /> {repo.stargazers_count}
                    </span>
                    <span>|</span>
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
          <PaginationControls
            page={page}
            setPage={setPage}
            total={user.public_repos} // total de repositórios do GitHub
            perPage={perPage}
          />
        </div>

        {/* Coluna 3: Favoritos */}
        <div className="flex flex-col items-center">
          <div className="text-xl font-bold">Favoritos</div>
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
    </div>
  );
}
