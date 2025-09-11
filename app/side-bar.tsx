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
  ForkKnifeIcon,
  Icon,
  Info,
  Pin,
  PinOff,
  Search,
  StarIcon,
  StarsIcon,
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

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
  const [showAvatars, setShowAvatars] = useState(true);
  const [showRepos, setShowRepos] = useState(true);
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
                    <SidebarMenuButton className="font-bold text-[12px] ">
                      Usuários Favoritos
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Info className="size-3" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Selecione como deseja visualizar os usuários
                            favoritos
                          </p>
                          <p>
                            Clique com o botão direito nos perfis para ver
                            repositórios com mais estrelas (Somente layout de
                            lista)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAvatars((prev) => !prev);
                        }}
                        className={`w-8 h-4 rounded-full p-[2px] cursor-pointer transition-colors duration-300 ${
                          showAvatars ? "bg-primary" : "bg-muted"
                        }`}
                      >
                        <div
                          className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                            showAvatars ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </div>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent
                    className="overflow-hidden
                     pb-5                               
                               transition-all
                               data-[state=closed]:animate-collapsible-up
                               data-[state=open]:animate-collapsible-down"
                  >
                    {showAvatars ? (
                      <div
                        className="px-4 mt-4 flex flex-wrap items-center 
                                   [&>*]:-ml-2  [&>*]:-mb-2 hover:[&>*]:ml-1 hover:[&>*]:mb-1
                                   [&>*]:transition-all [&>*]:duration-300 [&>*]:ease-in-out"
                      >
                        {favoriteUsers.map((user) => (
                          <Tooltip key={user.login}>
                            <TooltipTrigger asChild>
                              <Avatar
                                className="ring-2 ring-background basis-1/7 expanded:basis-1/5 hover:cursor-pointer hover:scale-120 hover:z-50 active:scale-200 active:z-50 "
                                onClick={() =>
                                  router.push(`/github/user/${user.login}`)
                                }
                              >
                                <AvatarImage src={user.avatar_url} />
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>
                              {user.name || user.login}
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    ) : (
                      <ScrollArea className="h-[160px]  ">
                        <SidebarMenuSub>
                          {favoriteUsers.map((user) => (
                            <SidebarMenuSubItem key={user.login}>
                              <FavoriteUserCard user={user} />
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </ScrollArea>
                    )}
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
                    <SidebarMenuButton className="font-bold text-[12px] ">
                      Repositórios Marcados
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowRepos((prev) => !prev);
                        }}
                        className={`w-8 h-4 rounded-full p-[2px] cursor-pointer transition-colors duration-300 ${
                          showRepos ? "bg-primary" : "bg-muted"
                        }`}
                      >
                        <div
                          className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                            showRepos ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </div>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent
                    className="overflow-hidden
                               transition-all
                               data-[state=closed]:animate-collapsible-up
                               data-[state=open]:animate-collapsible-down"
                  >
                    {/* Carrossel com cards */}
                    {showRepos ? (
                      <div className="flex flex-col items-center py-4">
                        <Carousel className="w-full max-w-[140px]">
                          <CarouselContent className="gap-4">
                            {favoriteRepos.map((repo) => (
                              <CarouselItem key={repo.id}>
                                <Card
                                  className=" flex flex-col hover:cursor-pointer hover:bg-secondary"
                                  onClick={() =>
                                    window.open(repo.html_url, "_blank")
                                  }
                                >
                                  <CardContent className="flex flex-col gap-2 !p-0">
                                    {/* Header com avatar e nome do criador */}
                                    <div className="flex items-center gap-2 p-2">
                                      <Avatar className="w-8 h-8">
                                        <AvatarImage
                                          src={repo.owner?.avatar_url}
                                        />
                                      </Avatar>
                                      <div className="flex flex-col ">
                                        <span className="flex flex-wrap font-semibold text-[10px] ">
                                          {repo.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground ">
                                          {repo.owner?.login}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Descrição */}

                                    <div className="h-[100px]">
                                      {repo.description ? (
                                        <p className="text-sm text-muted-foreground text-center p-2">
                                          {repo.description}
                                        </p>
                                      ) : (
                                        <p className="text-sm text-muted-foreground text-center p-2">
                                          ...
                                        </p>
                                      )}
                                    </div>

                                    {/* Informações adicionais */}
                                    <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
                                      {repo.language ? (
                                        <span className="">
                                          {repo.language}
                                        </span>
                                      ) : (
                                        <span className="">...</span>
                                      )}
                                      <div className="flex items-center gap-2">
                                        <span className="flex items-center gap-1">
                                          <div className="flex items-center gap-1">
                                            <StarIcon className="size-4" />
                                            {repo.stargazers_count}
                                          </div>
                                        </span>
                                        |
                                        <span className="flex items-center gap-1">
                                          <div className="flex items-center gap-1">
                                            <ForkKnifeIcon className="size-4" />
                                            {repo.forks_count}
                                          </div>
                                        </span>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious />
                          <CarouselNext />
                        </Carousel>
                      </div>
                    ) : (
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
                                    <div className="flex flex-col w-[100px] p-1">
                                      <span className="font-semibold text-[12px] truncate">
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
                    )}
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
