"use client";

import { useState, useEffect, use } from "react";
import { User, Repo } from "@/app/types";

import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import Favoritos from "@/app/favoritosComp";

import {
  FavoritosSkeleton,
  PerfilSkeleton,
  RepositoriosSkeleton,
} from "@/app/skeletons";
import PerfilCard from "./perfil";
import ReposList from "./repositorios";

import { bg9 } from "@/app/estilos";
import { useQuery } from "@tanstack/react-query"; //aq
import { userProfileQuery, userReposQuery } from "@/lib/query-options"; //aq

interface Props {
  params: Promise<{ username: string }>;
}

export default function UserPage({ params }: Props) {
  const { username } = use(params);

  const [favoritesLoading, setFavoritesLoading] = useState(true);

  const [page, setPage] = useState(1);
  const perPage = 30;

  // Loading e Error do perfil do usuário

  // Perfil
  const {
    data: user,
    isLoading: userLoading,
    isError: isUserError, //aq
    error: userError, //aq
  } = useQuery(userProfileQuery(username));

  // Loading e Error dos repositórios

  // Repos com paginação
  const {
    data: repos = [],
    isLoading: reposLoading,
    isError: isReposError,
    error: reposError,
  } = useQuery(userReposQuery(username, page, perPage));

  ////////////////////////////////////////////////////////////////////////////////
  // Estado para os usuários favoritos
  const [favoriteUsers, setFavoriteUsers] = useState<User[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("favoriteUsers");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  // Estado para os repositórios favoritos
  const [favoriteRepos, setFavoriteRepos] = useState<Repo[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("favoriteRepos");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  ////////////////////////////////////////////////////////////////////////////////
  // Favorite Users loading
  useEffect(() => {
    const stored = localStorage.getItem("favoriteUsers");
    if (stored) setFavoriteUsers(JSON.parse(stored));
    setFavoritesLoading(false); // <<< aqui
  }, []);

  // Favorite Repos loading
  useEffect(() => {
    const stored = localStorage.getItem("favoriteRepos");
    if (stored) setFavoriteRepos(JSON.parse(stored));
    setFavoritesLoading(false); // <<< aqui também
  }, []);
  ////////////////////////////////////////////////////////////////////////////////
  // Favorite Users: carrega do storage
  useEffect(() => {
    const stored = localStorage.getItem("favoriteUsers");
    if (stored) setFavoriteUsers(JSON.parse(stored));
  }, []);
  useEffect(() => {
    localStorage.setItem("favoriteUsers", JSON.stringify(favoriteUsers));
  }, [favoriteUsers]);
  // Favorite Repos: carrega do storage
  useEffect(() => {
    const stored = localStorage.getItem("favoriteRepos");
    if (stored) setFavoriteRepos(JSON.parse(stored));
  }, []);
  useEffect(() => {
    localStorage.setItem("favoriteRepos", JSON.stringify(favoriteRepos));
  }, [favoriteRepos]);
  ////////////////////////////////////////////////////////////////////////////////
  // Alternar favorito de usuario
  function toggleFavorite(user: User) {
    const isFav = favoriteUsers.some((fav) => fav.login === user.login);
    if (isFav) {
      setFavoriteUsers(favoriteUsers.filter((fav) => fav.login !== user.login));
    } else {
      setFavoriteUsers([...favoriteUsers, user]);
    }
  }
  // Alternar favorito de repositório
  function toggleFavoriteR(repo: Repo) {
    const isFav = favoriteRepos.some((fav) => fav.id === repo.id);
    if (isFav) {
      setFavoriteRepos(favoriteRepos.filter((fav) => fav.id !== repo.id));
    } else {
      setFavoriteRepos([...favoriteRepos, repo]);
    }
  }
  return (
    <div className="fixed top-0 left-0 flex flex-col w-full h-full" style={bg9}>
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
        {userLoading ? (
          <PerfilSkeleton />
        ) : isUserError ? (
          <div className="text-red-600">{userError?.message}</div>
        ) : (
          user && <PerfilCard user={user} />
        )}

        {/* Coluna 2: Repos */}
        {reposLoading ? (
          <RepositoriosSkeleton />
        ) : isReposError ? (
          <div className="text-red-600">{reposError?.message}</div>
        ) : (
          user && (
            <ReposList
              repos={repos}
              favoriteRepos={favoriteRepos}
              toggleFavoriteRepo={toggleFavoriteR}
              page={page}
              setPage={setPage}
              perPage={perPage}
              total={user.public_repos}
            />
          )
        )}

        {/* Coluna 3: Favoritos */}
        <div className="flex flex-col items-center">
          <div className="text-xl font-bold">Favoritos</div>

          {/* barrasssssss de favoritos */}
          {favoritesLoading ? (
            <FavoritosSkeleton />
          ) : (
            <Favoritos
              favoriteUsers={favoriteUsers}
              toggleFavorite={toggleFavorite}
              favoriteRepos={favoriteRepos}
              toggleFavoriteR={toggleFavoriteR}
            />
          )}
        </div>
      </div>
    </div>
  );
}
