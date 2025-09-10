"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSubItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Form,
  FormItem,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftIcon,
  AtSignIcon,
  ChevronRight,
  Icon,
  Info,
  Pin,
  PinOff,
  Search,
  StarIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { parseAsInteger, useQueryState } from "nuqs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { User, Repo } from "@/app/types";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useFavorites } from "./context/FavoritesContext";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { useQuery } from "@tanstack/react-query";
import { userReposQuery } from "@/lib/query-options";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AppSideBar() {
  const router = useRouter();
  const pathname = usePathname();

  const [username, setUsername] = useQueryState("username", {
    defaultValue: "",
  });
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const form = useForm<{ username: string }>({
    defaultValues: { username: "" },
  });

  ///////////////////////////////////////////////////////////////////////////////////
  // Estados de favoritos

  const { favoriteUsers, favoriteRepos, toggleFavorite, toggleFavoriteR } =
    useFavorites();

  // Salvar no localStorage quando qualquer favorito mudar
  useEffect(() => {
    localStorage.setItem("favoriteUsers", JSON.stringify(favoriteUsers));
    localStorage.setItem("favoriteRepos", JSON.stringify(favoriteRepos));
  }, [favoriteUsers, favoriteRepos]);

  /////////////////GAMBIARRA//////////////////////
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  //////////////////////////////////////////////////
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          {pathname === "/" && (
            <>
              <SidebarGroupLabel>Buscar Usuários do GitHub</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit((e) => {
                          setUsername(e.username || "");
                          setPage(1);
                        })}
                        className="flex gap-2 p-2"
                      >
                        <FormField
                          control={form.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  className=""
                                  placeholder="Digite o usuário"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit">
                          <Search />
                        </Button>
                      </form>
                    </Form>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </>
          )}
        </SidebarGroup>

        <SidebarGroup>
          {pathname.startsWith("/github/user") && (
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Button variant="link" asChild>
                    <Link href="/">
                      <ArrowLeftIcon className="size-7" />
                    </Link>
                  </Button>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>
        {/* Usuários Favoritos */}
        {isClient && (
          <SidebarGroup>
            <SidebarMenu>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="font-bold ">
                      Usuários Favoritos
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Info className="size-3" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Clique com o botão direito nos perfis para ver
                            repositórios com mais estrelas
                          </p>
                        </TooltipContent>
                      </Tooltip>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <ScrollArea className="h-[160px]  ">
                      <SidebarMenuSub>
                        {favoriteUsers.map((user) => (
                          <SidebarMenuSubItem key={user.login}>
                            <FavoriteUserCard user={user} />
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </ScrollArea>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroup>
        )}

        {/* Repositórios Favoritos */}
        {isClient && (
          <SidebarGroup>
            <SidebarMenu>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="font-bold ">
                      Repositórios Marcados
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <ScrollArea className="h-[320px]  ">
                      <SidebarMenuSub>
                        {favoriteRepos.length > 0 ? (
                          favoriteRepos.map((repo) => (
                            <SidebarMenuSubItem key={repo.id}>
                              <SidebarMenuSubButton asChild>
                                <div
                                  className="flex items-center justify-between min-h-[50px] gap-1 cursor-pointer hover:bg-muted"
                                  onClick={() =>
                                    window.open(repo.html_url, "_blank")
                                  }
                                >
                                  <div className="flex flex-col truncate p-1">
                                    <span className="font-semibold truncate">
                                      {repo.name}
                                    </span>
                                    <span className="text-xs truncate text-muted-foreground">
                                      {repo.owner?.login}
                                    </span>
                                    {repo.language && (
                                      <span className="text-xs truncate text-muted-foreground">
                                        {repo.language}
                                      </span>
                                    )}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleFavoriteR(repo);
                                    }}
                                  >
                                    <PinOff className="w-4 h-4text-black" />
                                  </Button>
                                </div>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))
                        ) : (
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <span>...</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )}
                      </SidebarMenuSub>
                    </ScrollArea>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}

////////////////////////////////////////////////////////////////////////////////////

function FavoriteUserCard({ user }: { user: User }) {
  //click direito aq
  const router = useRouter();
  const { toggleFavorite, favoriteUsers } = useFavorites();

  const { data: userRepos } = useQuery<Repo[]>(
    userReposQuery(user.login, 1, 100) //100 ja ta bom......
  );

  // Calcula os 5 mais estrelados, ordenados decrescente
  const topRepos = userRepos
    ? [...userRepos]
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 10)
    : [];

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className="flex items-center justify-between gap-2 cursor-pointer hover:bg-muted p-1 rounded"
          onClick={() => router.push(`/github/user/${user.login}`)}
        >
          <div className="flex items-center gap-2 truncate">
            <Avatar className="w-6 h-6">
              <AvatarImage src={user.avatar_url} alt={user.login} />
            </Avatar>
            <AtSignIcon className="w-4 h-4" />
            <span className="truncate">{user.login}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(user);
            }}
          >
            <StarIcon className="w-4 h-4 stroke-gray-400 fill-accent-foreground" />
          </Button>
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-64]">
        {topRepos.length > 0 ? (
          topRepos.map((repo: Repo) => (
            <ContextMenuItem
              key={repo.id}
              onClick={() => window.open(repo.html_url, "_blank")}
              className="flex justify-between"
            >
              <div>{repo.name}</div>
              <div className="flex items-center gap-1">
                <span>{repo.stargazers_count}</span>
                <StarIcon className="w-4 h-4 text-gray-400" />
              </div>
            </ContextMenuItem>
          ))
        ) : (
          <ContextMenuItem disabled>Nenhum repositório</ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
