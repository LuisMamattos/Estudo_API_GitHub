import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AtSignIcon, Star, StarIcon } from "lucide-react";
import PaginationControls from "@/app/PaginationControls";
import { bg5 } from "@/app/estilos";
import {
  unsetMarker,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { searchUsersQuery, userProfileQuery } from "@/lib/query-options";
import { parseAsString, useQueryState } from "nuqs";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense, useActionState } from "react";
import { useFavorites } from "@/app/context/FavoritesContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function SearchResults({
  page,
  setPage,
  total,
  perPage,
}: {
  page: number;
  setPage: (p: number) => void;
  total: number;
  perPage: number;
}) {
  const { favoriteUsers, toggleFavorite } = useFavorites();
  const queryClient = useQueryClient();
  const router = useRouter();
  // React Query
  const [username] = useQueryState("username", parseAsString.withDefault(""));

  const {
    data: userSearch,
    isLoading,
    isError,
    error,
  } = useQuery(searchUsersQuery(username, page, perPage));
  if (!username || username.trim() === "") {
    return (
      <div className="w-full flex justify-center p-20">
        <div className="text-3xl md:text-5xl lg:text-7xl text-center max-w-[800px]">
          Digite um usuário na barra ao lado para começar!
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <PesquisaSkeleton />;
  }
  if (isError) {
    return <>Erro ao buscar usuario</>; /////////////////////////////////////////////////////////////////////////////////////////////////////////
  }
  if (!userSearch || userSearch.items.length === 0) {
    return <>Nenhum usuario encontrado</>; /////////////////////////////////////////////////////////////////////////////////////////////////////////
  }
  return (
    <div className=" w-full">
      <ScrollArea className="h-[600] ">
        <div className="flex flex-col gap-1">
          {userSearch.items.map((user) => (
            <Card
              key={user.login}
              onClick={async () => {
                // baixa e coloca o perfil completo no cache, com as configs do userProfileQuery
                await queryClient.prefetchQuery(userProfileQuery(user.login));

                // navega sem reload
                router.push(`/github/user/${user.login}`);
              }}
              className="cursor-pointer mr-3 hover:bg-muted transition"
              style={bg5}
            >
              <CardContent className="flex flex-row items-center justify-between gap-4">
                <div className="flex flex-row items-center gap-2 cursor-pointer truncate">
                  <Avatar>
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
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(user);
                  }}
                  className="p-0 y-50 bg-transparent hover:bg-transparent hover:text-yellow-500"
                >
                  <Star
                    className={`w-5 h-5 ${
                      favoriteUsers.some((fav) => fav.login === user.login)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-400"
                    }`}
                  />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <Separator className="my-4 w-full bg-black " />
      {total > 0 && (
        <PaginationControls
          page={page}
          setPage={setPage}
          total={total}
          perPage={perPage}
        />
      )}
    </div>
  );
}

export function PesquisaSkeleton() {
  /* resultados da pesquisa */
  return (
    <div className="w-full">
      <div className="flex flex-col gap-1 w-full h-[600] overflow-auto">
        {Array.from({ length: 30 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="flex flex-row items-center justify-between gap-4">
              <div className="flex flex-row items-center gap-2">
                <Skeleton className="size-[36] rounded-full" />
                <Skeleton className=" w-[300] h-[30] rounded-xl" />
              </div>

              <StarIcon className="size-5 mr-2 fill-gray-200 stroke-gray-200" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
