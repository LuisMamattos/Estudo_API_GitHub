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

export default function HomePage() {
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const perPage = 30;
  const [users, setUsers] = useState<User[]>([]);
  const [userLoading, setUserLoading] = useState(false);

  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<{ username: string }>({
    defaultValues: { username: "" },
  });
  ///////////////////////////////////////////////////////////////////////
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
  ///////////////////////////////////////////////////////////////////////
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
  ///////////////////////////////////////////////////////////////////////
  // Salvar favoritos no localStorage
  useEffect(() => {
    localStorage.setItem("favoriteUsers", JSON.stringify(favoriteUsers));
  }, [favoriteUsers]);
  // Salvar favoritos de repositórios no localStorage
  useEffect(() => {
    localStorage.setItem("favoriteRepos", JSON.stringify(favoriteRepos));
  }, [favoriteRepos]);
  ///////////////////////////////////////////////////////////////////////
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
  ///////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (form.getValues("username")) {
      handleSearch({ username: form.getValues("username") });
    }
  }, [page]);

  async function handleSearch(data: { username: string }) {
    if (!data.username) return;
    try {
      setUserLoading(true);
      setError(null);
      const res = await fetch(
        `/api/search/users?q=${encodeURIComponent(
          data.username
        )}&page=${page}&per_page=${perPage}`
      );

      if (!res.ok) throw new Error("Erro ao buscar usuários");
      const json = await res.json();
      setUsers(json.items);
      setTotal(json.total);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Erro ao carregar usuários");
      }
    } finally {
      setUserLoading(false);
    }
  }

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
              onSubmit={form.handleSubmit(handleSearch)}
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

      {/* conteudo */}
      <div className=" flex space-y-6 gap-1 justify-between text-center p-3">
        {/* resultados da pesquisa */}
        {userLoading ? (
          <PesquisaSkeleton />
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
  );
}
