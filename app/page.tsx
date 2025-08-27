"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { useForm } from "react-hook-form";
import {
  Form,
  FormItem,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { AtSignIcon, Search } from "lucide-react";
import fundo from "@/images/fundo2.jpg";
import fundodiv from "@/images/fundo3.avif";

interface User {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  email: string | null;
  location: string | null;
  html_url: string;
}
export default function HomePage() {
  const [users, setUsers] = useState<User[]>([]);

  const form = useForm<{ username: string }>({
    defaultValues: { username: "" },
  });

  async function handleSearch(data: { username: string }) {
    if (!data.username) return;

    const res = await fetch(
      `https://api.github.com/search/users?q=${data.username}`
    );
    const result = await res.json();
    setUsers(result.items || []);
  }

  return (
    <div
      className="fixed top-0 left-0 flex flex-col w-full h-full"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundImage: `url(${fundo.src})`,
      }}
    >
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
      <div className="pt-16 flex flex-col space-y-6 items-center text-center">
        <div className="grid gap-4 w-[700]">
          {users.slice(0, 5).map((user) => (
            <Card
              key={user.login}
              className="cursor-pointer hover:bg-muted transition "
              onClick={() =>
                (window.location.href = `/github/user/${user.login}`)
              }
              style={{
                backgroundSize: "cover",
                backgroundImage: `url(${fundodiv.src})`,
              }}
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="size-15">
                  <AvatarImage src={user.avatar_url} alt={user.login} />
                </Avatar>
                <span className="font-medium text-2xl">
                  <p className="flex items-center gap-1">
                    <AtSignIcon className="size-3" />
                    {user.login}
                  </p>
                </span>
              </CardHeader>
            </Card>
          ))}
        </div>
        <img
          src="https://raw.githubusercontent.com/aayushgoyal/aayushgoyal/master/github.gif"
          alt="github dançarino"
          className="w-100 h-100 rounded-full"
        />
      </div>
    </div>
  );
}
