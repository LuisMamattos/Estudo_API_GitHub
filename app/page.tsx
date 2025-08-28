"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import {
  Form,
  FormItem,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { AtSignIcon, Search, Star } from "lucide-react";
import Favoritos from "./favoritosComp";
import { User, Repo } from "@/app/types";

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [favoriteUsers, setFavoriteUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem("favoriteUsers");
    return stored ? JSON.parse(stored) : [];
  });

  const form = useForm<{ username: string }>({
    defaultValues: { username: "" },
  });

  // Salvar favoritos no localStorage
  useEffect(() => {
    localStorage.setItem("favoriteUsers", JSON.stringify(favoriteUsers));
  }, [favoriteUsers]);

  async function handleSearch(data: { username: string }) {
    if (!data.username) return;

    const res = await fetch(
      `https://api.github.com/search/users?q=${data.username}`
    );
    const result = await res.json();
    setUsers(result.items || []);
  }

  function toggleFavorite(user: User) {
    const isFav = favoriteUsers.some((fav) => fav.login === user.login);
    if (isFav) {
      setFavoriteUsers(favoriteUsers.filter((fav) => fav.login !== user.login));
    } else {
      setFavoriteUsers([...favoriteUsers, user]);
    }
  }
  // Estado para os repositórios favoritos
  const [favoriteRepos, setFavoriteRepos] = useState<Repo[]>(() => {
    const stored = localStorage.getItem("favoriteRepos");
    return stored ? JSON.parse(stored) : [];
  });

  // Salvar favoritos de repositórios no localStorage
  useEffect(() => {
    localStorage.setItem("favoriteRepos", JSON.stringify(favoriteRepos));
  }, [favoriteRepos]);

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
    <div className="fixed top-0 left-0 flex flex-col w-full h-full">
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
        <div className="flex flex-col gap-1 w-[700px] h-[820] overflow-auto">
          {users.slice(0, 100).map((user) => (
            <Card
              key={user.login}
              className="cursor-pointer hover:bg-muted transition"
            >
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div
                  onClick={() =>
                    (window.location.href = `/github/user/${user.login}`)
                  }
                  className="flex flex-row items-center gap-4 cursor-pointer truncate"
                >
                  <Avatar className="size-15">
                    <AvatarImage src={user.avatar_url} alt={user.login} />
                  </Avatar>
                  <span className="font-medium text-2xl">
                    <p className="flex items-center gap-1">
                      <AtSignIcon className="size-6" />
                      {user.login}
                    </p>
                  </span>
                </div>
                <Button
                  variant={"ghost"}
                  onClick={() => toggleFavorite(user)}
                  className="p-0 bg-transparent hover:bg-transparent hover:text-yellow-500"
                >
                  <Star
                    className={`w-5 h-5 ${
                      favoriteUsers.some((fav) => fav.login === user.login)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-400"
                    }`}
                  />
                </Button>
              </CardHeader>
            </Card>
          ))}
        </div>
        {/* barrasssss de favoritos */}
        <Favoritos
          favoriteUsers={favoriteUsers}
          toggleFavorite={toggleFavorite}
          favoriteRepos={favoriteRepos}
          toggleFavoriteR={toggleFavoriteR}
        />
      </div>
    </div>
  );
}
