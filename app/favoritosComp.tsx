"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Star as StarIcon, AtSignIcon } from "lucide-react";
import { User, Repo } from "@/app/types";
import { Button } from "@/components/ui/button";
import { bg1, bg2, bg3, bg4 } from "@/app/estilos";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { userProfileQuery } from "@/lib/query-options";

interface FavoritosProps {
  // Usuários favoritos
  favoriteUsers: User[];
  toggleFavorite: (user: User) => void;

  // Repositórios favoritos
  favoriteRepos: Repo[];
  toggleFavoriteR: (repo: Repo) => void;
}
export default function Favoritos({
  favoriteRepos,
  toggleFavoriteR,
  favoriteUsers,
  toggleFavorite,
}: Readonly<FavoritosProps>) {
  const queryClient = useQueryClient();
  const router = useRouter();
  return (
    <div className="flex flex-col gap-1">
      {/* Perfis favoritos */}
      <Card style={bg1} className="bg-white rounded-xl w-[235px] p-3 ">
        <CardHeader>
          <CardTitle className="flex items-center text-center text-amber-400 text-lg font-bold">
            <StarIcon className="size-5 mr-2 fill-amber-300 stroke-amber-500" />
            Perfis
          </CardTitle>
        </CardHeader>

        <CardContent className="rounded-xl p-0 w-[210px] h-[200px] overflow-y-auto flex flex-col gap-2">
          {favoriteUsers.map((user) => (
            <Card
              key={user.login}
              className="flex p-1 hover:bg-muted cursor-pointer"
              style={bg3}
              onClick={async () => {
                // baixa e coloca o perfil completo no cache, com as configs do userProfileQuery
                await queryClient.prefetchQuery(userProfileQuery(user.login));

                // navega sem reload
                router.push(`/github/user/${user.login}`);
              }}
            >
              <CardContent className="flex items-center gap-2 font-semibold truncate justify-between">
                <div className="flex items-center truncate">
                  <Avatar className="w-8 h-8 flex-shrink-0 border-1 border-blue-700">
                    <AvatarImage src={user.avatar_url} alt={user.login} />
                  </Avatar>
                  <AtSignIcon className="size-4 flex-shrink-0" />
                  {user.login}
                </div>

                <div>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(user);
                    }}
                  >
                    <StarIcon
                      className={`w-5 h-5 ${
                        favoriteUsers.some((fav) => fav.login === user.login)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-400"
                      }`}
                    />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Repositórios favoritos */}
      <Card style={bg2} className="bg-white rounded-xl w-[235px] p-3">
        <CardHeader>
          <CardTitle className="flex items-center text-amber-400 text-center text-lg font-bold">
            <StarIcon className="size-5 mr-2 fill-amber-300 stroke-amber-500" />
            Repositórios
          </CardTitle>
        </CardHeader>

        <CardContent className="rounded-xl p-0 w-[210px] h-[200px] overflow-y-auto flex flex-col gap-2">
          {favoriteRepos?.map((repo) => (
            <Card
              onClick={() => window.open(repo.html_url, "_blank")}
              key={repo.id}
              className="flex p-1 hover:bg-muted cursor-pointer"
              style={bg4}
            >
              <CardContent className="flex flex-col gap-1 w-full">
                {/* Linha de nome */}
                <div className="flex justify-between items-center">
                  <div className="truncate font-bold">{repo.name}</div>
                  <div>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoriteR && toggleFavoriteR(repo);
                      }}
                      className="p-0 z-50"
                    >
                      <StarIcon className="w-4 h-4 flex-shrink-0 fill-yellow-400 text-blue-700" />
                    </Button>
                  </div>
                </div>

                {/* Dono e linguagem */}
                <div className="flex justify-between items-center text-xs">
                  <span className=" font-semibold">@{repo.owner?.login}</span>
                  {repo.language && (
                    <span className="text-blue-800 font-semibold italic">
                      {repo.language}
                    </span>
                  )}
                </div>

                {/* Estrelas */}
                <div className="flex text-center items-center text-xs text-muted-foreground">
                  <StarIcon className="w-4 h-4" /> {repo.stargazers_count}
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
