"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import {
  Form,
  FormItem,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Search } from "lucide-react";

import Favoritos from "./favoritosComp";
import { User, Repo } from "@/app/types";

import { FavoritosSkeleton, PesquisaSkeleton } from "./skeletons";
import SearchResults from "./searchResults";
import { bg6 } from "@/app/estilos";

import { useQuery, keepPreviousData } from "@tanstack/react-query";

export default function HomePage() {
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const perPage = 30;

  const form = useForm<{ username: string }>({
    defaultValues: { username: "" },
  });

  ///////////////////////////////////////////////////////////////////////
  // Estado para favoritos
  const [favoriteUsers, setFavoriteUsers] = useState<User[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("favoriteUsers");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const [favoriteRepos, setFavoriteRepos] = useState<Repo[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("favoriteRepos");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const [favoritesLoading, setFavoritesLoading] = useState(true);

  ///////////////////////////////////////////////////////////////////////
  // Carregar favoritos do localStorage
  useEffect(() => {
    const storedUsers = localStorage.getItem("favoriteUsers");
    const storedRepos = localStorage.getItem("favoriteRepos");

    if (storedUsers) setFavoriteUsers(JSON.parse(storedUsers));
    if (storedRepos) setFavoriteRepos(JSON.parse(storedRepos));

    setFavoritesLoading(false);
  }, []);

  // Salvar favoritos no localStorage
  useEffect(() => {
    localStorage.setItem("favoriteUsers", JSON.stringify(favoriteUsers));
  }, [favoriteUsers]);

  useEffect(() => {
    localStorage.setItem("favoriteRepos", JSON.stringify(favoriteRepos));
  }, [favoriteRepos]);

  ///////////////////////////////////////////////////////////////////////
  // Alternar favoritos
  function toggleFavorite(user: User) {
    const isFav = favoriteUsers.some((fav) => fav.login === user.login);
    if (isFav) {
      setFavoriteUsers(favoriteUsers.filter((fav) => fav.login !== user.login));
    } else {
      setFavoriteUsers([...favoriteUsers, user]);
    }
  }

  function toggleFavoriteR(repo: Repo) {
    const isFav = favoriteRepos.some((fav) => fav.id === repo.id);
    if (isFav) {
      setFavoriteRepos(favoriteRepos.filter((fav) => fav.id !== repo.id));
    } else {
      setFavoriteRepos([...favoriteRepos, repo]);
    }
  }

  ///////////////////////////////////////////////////////////////////////
  // React Query: buscar usuários
  const username = form.getValues("username");
  const [searchUsername, setSearchUsername] = useState("");
  const {
    data: users = [],
    isLoading: userLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["searchUsers", username, page],
    queryFn: async () => {
      if (!username) return [];
      const res = await fetch(
        `/api/search/users?q=${encodeURIComponent(
          username
        )}&page=${page}&per_page=${perPage}`
      );
      if (!res.ok) throw new Error("Erro ao buscar usuários");
      const json = await res.json();
      setTotal(json.total);
      return json.items;
    },
    enabled: !!username, // só busca se username existir
  });

  ///////////////////////////////////////////////////////////////////////
  // Render
  return (
    <div className="fixed top-0 left-0 flex flex-col w-full h-full" style={bg6}>
      {/* Barra superior */}
      <div className="z-50 rounded-b-lg flex justify-between items-center bg-blue-950 p-4 w-full">
        <h1 className="text-2xl font-bold text-amber-50 truncate">
          Buscar Usuários do GitHub
        </h1>
        <div className="flex items-center gap-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => {
                setSearchUsername(data.username);
                setPage(1);
              })}
              className="flex gap-2"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="bg-amber-50"
                        placeholder="Digite o nome de usuário"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="bg-blue-950" type="submit">
                <Search />
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex space-y-6 gap-1 justify-between text-center p-3">
        {/* Resultados da pesquisa */}
        {userLoading ? (
          <PesquisaSkeleton />
        ) : isError ? (
          <span>{(error as Error).message}</span>
        ) : (
          <SearchResults
            users={users}
            page={page}
            setPage={setPage}
            total={total}
            perPage={perPage}
            favoriteUsers={favoriteUsers}
            toggleFavorite={toggleFavorite}
          />
        )}

        {/* Favoritos */}
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
  );
}
