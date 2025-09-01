"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Star, Utensils, Code } from "lucide-react";
import PaginationControls from "@/app/PaginationControls";
import { Repo } from "@/app/types";

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
      <div className="text-xl font-bold">Repositórios</div>

      <div className="grid gap-1 font-semibold h-[720px] w-full overflow-y-auto">
        {repos.map((repo) => (
          <Card key={repo.id}>
            <CardHeader className="flex justify-between items-center">
              <Link
                href={repo.html_url}
                target="_blank"
                className="font-medium text-primary truncate"
              >
                {repo.name}
              </Link>

              {/* Botão de favoritar */}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => toggleFavoriteRepo(repo)}
              >
                <Star
                  className={`w-5 h-5 ${
                    favoriteRepos.some((fav) => fav.id === repo.id)
                      ? "fill-yellow-400 text-yellow-400"
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

      <PaginationControls
        page={page}
        setPage={setPage}
        total={total}
        perPage={perPage}
      />
    </div>
  );
}
