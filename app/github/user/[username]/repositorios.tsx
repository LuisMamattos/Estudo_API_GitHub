"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Star,
  Utensils,
  Code,
  ExternalLink,
  Pin,
  AlertCircleIcon,
  UserIcon,
  FileCode,
} from "lucide-react";
import PaginationControls from "@/app/PaginationControls";
import { Repo } from "@/app/types";
import { bg8 } from "@/app/estilos";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface ReposListProps {
  repos: Repo[];
  favoriteRepos: Repo[];
  toggleFavoriteRepo: (repo: Repo) => void;
  page: number;
  setPage: (p: number) => void;
  perPage: number;
  total: number;
}

export default function ReposList({
  repos,
  favoriteRepos,
  toggleFavoriteRepo,
  page,
  setPage,
  perPage,
  total,
}: ReposListProps) {
  return (
    <div className="flex flex-col w-full items-center">
      <ScrollArea className="h-[720px] w-full">
        <div className="grid gap-1 font-semibold h-[720px] w-full ">
          {repos.map((repo) => (
            <Card
              key={repo.id}
              style={bg8}
              className="mr-3 border-gray-400 transition-colors cursor-pointer"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--secondary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "";
              }}
              onClick={() => window.open(repo.html_url, "_blank")}
            >
              <CardHeader className="flex justify-between items-center">
                {repo.name}

                {/* Botão de favoritar */}
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavoriteRepo(repo);
                  }}
                >
                  <Pin
                    className={`w-5 h-5 ${
                      favoriteRepos.some((fav) => fav.id === repo.id)
                        ? "stroke-gray-400 fill-accent-foreground"
                        : ""
                    }`}
                  />
                </Button>
              </CardHeader>

              <CardDescription className="text-center items-center mx-2">
                <p className="text-muted-foreground">{repo.description}</p>
              </CardDescription>

              <CardContent className="flex justify-between">
                <Badge>
                  <p className="text-sm flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Star className="size-3" /> {repo.stargazers_count}
                    </span>
                    <span>|</span>
                    <span className="flex items-center gap-1">
                      <Utensils className="size-3" /> {repo.forks_count}
                    </span>
                  </p>
                </Badge>

                {repo.language && (
                  <Badge>
                    <span className="text-sm flex items-center gap-1 truncate">
                      <Code className="size-3" /> {repo.language}
                    </span>
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
      <PaginationControls
        page={page}
        setPage={setPage}
        total={total}
        perPage={perPage}
      />
    </div>
  );
}
export function RepositoriosSkeleton() {
  /* repositorios */
  return (
    <div className="flex flex-col w-full items-center">
      <div className="grid gap-1 font-semibold h-[720px] w-full overflow-y-auto">
        {Array.from({ length: 30 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex justify-between items-center">
              <Skeleton className="h-[20px] w-[150px]  rounded-xl" />
              <Pin className="size-4 mr-2 " />
            </CardHeader>

            <CardDescription className="flex justify-center">
              <Skeleton className="h-[32px] w-[200px]  rounded-xl" />
            </CardDescription>

            <CardContent className="flex justify-between">
              <Skeleton className="h-[20px] w-[100px]  rounded-xl" />
              <Skeleton className="h-[20px] w-[50px]  rounded-xl" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
export function RepositoriosError() {
  /* repositorios */
  return (
    <div className="flex flex-col w-full items-center">
      <div className="grid gap-1 font-semibold h-[720px] w-full overflow-y-auto">
        <Card className="border-red-300">
          <CardHeader className="flex flex-col items-center text-center gap-4 w-full">
            <div className="flex flex-col items-center text-center w-full max-w-[400px]">
              <FileCode className="w-full  p-6 h-auto aspect-square " />
            </div>
            <div className="flex flex-col w-full   gap-4">
              <Alert variant="destructive" className=" ">
                <AlertCircleIcon />
                <AlertTitle className="text-xl">
                  Ops, algo deu errado!
                </AlertTitle>
                <AlertDescription className="p-6">
                  Não conseguimos carregar os repositórios deste usuário. A API
                  pode estar instavel, aguarde um momento e tente novamente!
                </AlertDescription>
              </Alert>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
