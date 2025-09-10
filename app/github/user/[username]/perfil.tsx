"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  AtSignIcon,
  MapPin,
  Github,
  UserX,
  AlertCircleIcon,
  User as UserIcon,
  Star,
} from "lucide-react";
import { User } from "@/app/types";
import { bg7 } from "@/app/estilos";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFavorites } from "@/app/context/FavoritesContext";

export default function PerfilCard({ user }: { user: User }) {
  const { favoriteUsers, toggleFavorite } = useFavorites();
  return (
    <div className="flex flex-col w-full max-w-[400px] min-w-50 items-center">
      <div className="flex-1 w-full ">
        <Card
          style={bg7}
          className="border-gray-400 hover:cursor-pointer"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--secondary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "";
          }}
          onClick={() => window.open(user.html_url, "_blank")}
        >
          <CardHeader className="flex flex-col items-center text-center gap-4 w-full">
            <div className="flex flex-col items-center text-center w-full">
              <Avatar className="w-full h-full">
                <AvatarImage src={user.avatar_url} alt={user.login} />
              </Avatar>
              <CardTitle className="text-[clamp(1rem,2vw,10rem)] font-bold break-words">
                {user.name || user.login}
              </CardTitle>
            </div>

            <div className="flex items-center justify-between w-full">
              <div className="w-full space-y-1 text-left font-semibold">
                <p className="flex items-center gap-1 italic truncate">
                  <AtSignIcon className="size-3 shrink-0" />
                  {user.login}
                </p>
                {user.bio && <p>{user.bio}</p>}
                {user.email && <p>{user.email}</p>}
                {user.location && (
                  <p className="flex items-center gap-1 truncate">
                    <MapPin className="size-3 shrink-0" />
                    {user.location}
                  </p>
                )}
              </div>
              <div>
                {user.html_url && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(user);
                    }}
                    className="p-0 bg-transparent hover:bg-transparent"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        favoriteUsers.some((fav) => fav.login === user.login)
                          ? " stroke-gray-400 fill-accent-foreground"
                          : "text-gray-400"
                      }`}
                    />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
export function PerfilSkeleton() {
  /* perfil */
  return (
    <div className="flex flex-col w-full max-w-[400px] min-w-50 items-center">
      <div className="flex-1 w-full ">
        <Card>
          <CardHeader className="flex flex-col items-center text-center gap-4 w-full">
            <div className="flex flex-col items-center text-center w-full">
              <Skeleton className="w-full h-auto aspect-square rounded-full" />
            </div>
            <Skeleton className="h-[40px] w-[150px]  rounded-xl" />
            <div className="w-full space-y-1 text-left font-semibold">
              <Skeleton className="h-[20px] w-[150px]    rounded-xl" />
              <Skeleton className="h-[20px]  w-[200px]   rounded-xl" />
              <Skeleton className="h-[20px] w-[250px]  rounded-xl" />
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
export function PerfilError() {
  /* perfil */
  return (
    <div className="flex flex-col w-full max-w-[400px] min-w-50 items-center ">
      <div className="flex-1 w-full ">
        <Card className="border-red-300">
          <CardHeader className="flex flex-col items-center text-center gap-4 w-full">
            <div className="flex flex-col items-center text-center w-full">
              <UserIcon className="w-full p-6 h-auto aspect-square " />
            </div>
            <div className="flex flex-col w-full   gap-4">
              <Alert variant="destructive" className=" ">
                <AlertCircleIcon />
                <AlertTitle className="text-xl">
                  Ops, algo deu errado!
                </AlertTitle>
                <AlertDescription className="p-6">
                  Não conseguimos carregar os dados deste perfil. A API pode
                  estar instavel, aguarde um momento e tente novamente!
                </AlertDescription>
              </Alert>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
