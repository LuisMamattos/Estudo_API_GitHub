"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Star, Utensils, Code, ExternalLink, Pin } from "lucide-react";
import PaginationControls from "@/app/PaginationControls";
import { Repo } from "@/app/types";
import { bg8 } from "@/app/estilos";
import { ScrollArea } from "@/components/ui/scroll-area";

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
            <Card key={repo.id} style={bg8} className="mr-3">
              <CardHeader className="flex justify-between items-center">
                <Link
                  href={repo.html_url}
                  target="_blank"
                  className="flex items-center gap-1 font-medium text-primary truncate"
                >
                  {repo.name}
                  <ExternalLink className="w-4 h-4 text-gray-600 " />
                </Link>

                {/* Botão de favoritar */}
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => toggleFavoriteRepo(repo)}
                >
                  <Pin
                    className={`w-5 h-5 ${
                      favoriteRepos.some((fav) => fav.id === repo.id)
                        ? "fill-yellow-400 text-black"
                        : ""
                    }`}
                  />
                </Button>
              </CardHeader>

              <CardDescription className="text-center items-center">
                <p className="text-muted-foreground">{repo.description}</p>
              </CardDescription>

              <CardContent className="flex justify-between">
                <p className="text-sm flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <Star className="size-3" /> {repo.stargazers_count}
                  </span>
                  <span>|</span>
                  <span className="flex items-center gap-1">
                    <Utensils className="size-3" /> {repo.forks_count}
                  </span>
                </p>
                {repo.language && (
                  <span className="text-sm text-amber-700 flex items-center gap-1 truncate">
                    <Code className="size-3" /> {repo.language}
                  </span>
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
