"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Star as StarIcon, AtSignIcon } from "lucide-react";
import fundodiv from "@/images/fundo3.avif";
import fundofavoritos from "@/images/fundoStar.jpg";
import { User, Repo } from "@/app/types";

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
}: FavoritosProps) {
  return (
    <div className="flex flex-col gap-3 p-3">
      {/* Perfis favoritos */}
      <Card
        className="bg-white rounded-xl w-[235px] p-3"
        style={{
          backgroundSize: "cover",
          backgroundImage: `url(${fundodiv.src})`,
        }}
      >
        <CardHeader>
          <CardTitle className="flex items-center text-center text-lg font-bold">
            <StarIcon className="size-5 mr-2 fill-amber-300 stroke-amber-500" />
            Perfis
          </CardTitle>
        </CardHeader>

        <CardContent className="rounded-xl p-0 w-[222px] h-[200px] overflow-y-auto flex flex-col gap-2">
          {favoriteUsers.map((user) => (
            <Card
              key={user.login}
              className="flex p-1 hover:bg-muted cursor-pointer"
              style={{
                backgroundSize: "cover",
                backgroundImage: `url(${fundofavoritos.src})`,
              }}
            >
              <CardContent
                onClick={() =>
                  (window.location.href = `/github/user/${user.login}`)
                }
                className="flex items-center gap-2 font-semibold truncate justify-between"
              >
                <div className="flex items-center truncate">
                  <Avatar className="w-8 h-8 flex-shrink-0 border-1 border-blue-700">
                    <AvatarImage src={user.avatar_url} alt={user.login} />
                  </Avatar>
                  <AtSignIcon className="size-4 flex-shrink-0" />
                  {user.login}
                </div>

                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(user);
                    }}
                    className="p-1 hover:text-yellow-500"
                  >
                    <StarIcon
                      className={`w-5 h-5 ${
                        favoriteUsers.some((fav) => fav.login === user.login)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Repositórios favoritos */}
      <Card
        className="bg-white rounded-xl w-[235px] p-3"
        style={{
          backgroundSize: "cover",
          backgroundImage: `url(${fundodiv.src})`,
        }}
      >
        <CardHeader>
          <CardTitle className="flex items-center text-center text-lg font-bold">
            <StarIcon className="size-5 mr-2 fill-amber-300 stroke-amber-500" />
            Repositórios
          </CardTitle>
        </CardHeader>

        <CardContent className="rounded-xl p-0 w-[222px] h-[200px] overflow-y-auto flex flex-col gap-2">
          {favoriteRepos?.map((repo) => (
            <Card
              onClick={() => window.open(repo.html_url, "_blank")}
              key={repo.id}
              className="flex p-1 hover:bg-muted cursor-pointer"
              style={{
                backgroundSize: "cover",
                backgroundImage: `url(${fundofavoritos.src})`,
              }}
            >
              <CardContent className="flex flex-col gap-1 w-full">
                {/* Linha de nome */}
                <div className="flex justify-between items-center">
                  <div className="truncate font-bold">{repo.name}</div>
                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoriteR && toggleFavoriteR(repo);
                      }}
                      className="p-0 z-50"
                    >
                      <StarIcon className="w-4 h-4 flex-shrink-0 fill-yellow-400 text-blue-700" />
                    </button>
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
