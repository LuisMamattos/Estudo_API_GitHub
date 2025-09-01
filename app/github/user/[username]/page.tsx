"use client";

import { useState, useEffect, use } from "react";
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

import {
  FavoritosSkeleton,
  PerfilSkeleton,
  RepositoriosSkeleton,
} from "@/app/skeletons";
import PerfilCard from "./perfil";
import ReposList from "./repositorios";

interface Props {
  params: Promise<{ username: string }>;
}

export default function UserPage({ params }: Props) {
  const { username } = use(params);

  const [user, setUser] = useState<User | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [userLoading, setUserLoading] = useState(true);
  const [reposLoading, setReposLoading] = useState(true);
  const [favoritesLoading, setFavoritesLoading] = useState(true);

  const [favoriteUsers, setFavoriteUsers] = useState<User[]>([]);
  const [favoriteRepos, setFavoriteRepos] = useState<Repo[]>([]);

  const [page, setPage] = useState(1);
  const perPage = 30;

  // Loading e Error do perfil do usuário

  const [userError, setUserError] = useState<string | null>(null);

  // Perfil
  useEffect(() => {
    let alive = true;
    (async () => {
      setUserLoading(true);
      setUserError(null);
      try {
        const res = await fetch(`/api/users/${username}`);
        if (!res.ok) throw new Error("Erro ao carregar perfil"); /////
        const data = await res.json();
        if (alive) setUser(data);
      } catch (e: any) {
        if (alive)
          setUserError(e.message || "Outro tipo de erro ao carregar perfil");
      } finally {
        if (alive) setUserLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [username]);

  // Loading e Error dos repositórios
  const [reposError, setReposError] = useState<string | null>(null);

  // Repos com paginação
  useEffect(() => {
    let alive = true;
    (async () => {
      setReposLoading(true);
      setReposError(null);
      try {
        const res = await fetch(
          `/api/users/${username}/repos?page=${page}&per_page=${perPage}`
        );
        if (!res.ok) throw new Error("Erro ao carregar repositórios");
        const data = await res.json();
        if (alive) setRepos(data);
      } catch (e: any) {
        if (alive)
          setReposError(
            e.message || "Outro tipo de erro ao carregar repositórios"
          );
      } finally {
        if (alive) setReposLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [username, page]);

  // Favorite Users: carrega do storage
  // useEffect(() => {
  //   const stored = localStorage.getItem("favoriteUsers");
  //   if (stored) setFavoriteUsers(JSON.parse(stored));
  // }, []);
  // useEffect(() => {
  //   localStorage.setItem("favoriteUsers", JSON.stringify(favoriteUsers));
  // }, [favoriteUsers]);

  // // Favorite Repos: carrega do storage
  // useEffect(() => {
  //   const stored = localStorage.getItem("favoriteRepos");
  //   if (stored) setFavoriteRepos(JSON.parse(stored));
  // }, []);
  // useEffect(() => {
  //   localStorage.setItem("favoriteRepos", JSON.stringify(favoriteRepos));
  // }, [favoriteRepos]);

  // Toggle user favorito
  function toggleFavoriteUser(user: User) {
    const isFav = favoriteUsers.some((fav) => fav.login === user.login);
    setFavoriteUsers(
      isFav
        ? favoriteUsers.filter((fav) => fav.login !== user.login)
        : [...favoriteUsers, user]
    );
  }

  // Toggle repo favorito
  function toggleFavoriteRepo(repo: Repo) {
    const isFav = favoriteRepos.some((fav) => fav.id === repo.id);
    setFavoriteRepos(
      isFav
        ? favoriteRepos.filter((fav) => fav.id !== repo.id)
        : [...favoriteRepos, repo]
    );
  }
  // Favorite Users
  // useEffect(() => {
  //   const stored = localStorage.getItem("favoriteUsers");
  //   if (stored) setFavoriteUsers(JSON.parse(stored));
  //   setFavoritesLoading(false); // <<< aqui
  // }, []);

  // // Favorite Repos
  // useEffect(() => {
  //   const stored = localStorage.getItem("favoriteRepos");
  //   if (stored) setFavoriteRepos(JSON.parse(stored));
  //   setFavoritesLoading(false); // <<< aqui também
  // }, []);

  return (
    <div className="fixed top-0 left-0 flex flex-col w-full h-full">
      {/* Cabeçalho (literalmente so uma seta) */}
      <div className=" p-0 m-0 flex items-center justify-between">
        <Button variant="link" asChild>
          <Link href="/">
            <ArrowLeftIcon className="size-7 fill-current" />
          </Link>
        </Button>
      </div>

      <div className="flex flex-row gap-1 justify-between p-3">
        {/* Coluna 1: Card com usuário */}
        {userLoading ? <PerfilSkeleton /> : <PerfilCard user={user} />}

        {/* Coluna 2: Repos */}
        {reposLoading ? (
          <RepositoriosSkeleton />
        ) : (
          user && (
            <ReposList
              repos={repos}
              favoriteRepos={favoriteRepos}
              toggleFavoriteRepo={toggleFavoriteRepo}
              page={page}
              setPage={setPage}
              perPage={perPage}
              total={user.public_repos} // total de repositórios
            />
          )
        )}

        {/* Coluna 3: Favoritos */}
        <div className="flex flex-col items-center">
          <div className="text-xl font-bold">Favoritos</div>

          <Favoritos
            favoriteRepos={favoriteRepos}
            toggleFavoriteR={toggleFavoriteRepo}
            favoriteUsers={favoriteUsers}
            toggleFavorite={toggleFavoriteUser}
          />
        </div>
      </div>
    </div>
  );
}
