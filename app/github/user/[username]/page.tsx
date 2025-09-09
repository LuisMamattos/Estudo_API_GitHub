"use client";

import { useState, useEffect, use } from "react";
import { PerfilSkeleton, RepositoriosSkeleton } from "@/app/skeletons";
import PerfilCard from "./perfil";
import ReposList from "./repositorios";

import { useQuery } from "@tanstack/react-query"; //aq
import { userProfileQuery, userReposQuery } from "@/lib/query-options"; //aq
import { useFavorites } from "@/app/context/FavoritesContext";

interface Props {
  params: Promise<{ username: string }>;
}

export default function UserPage({ params }: Props) {
  const { username } = use(params);

  const { favoriteUsers, toggleFavorite, favoriteRepos, toggleFavoriteR } =
    useFavorites(); // <- aqui

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

  return (
    <div className="">
      <div className="flex flex-row gap-1 justify-between">
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
      </div>
    </div>
  );
}
