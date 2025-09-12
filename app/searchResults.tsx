import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertCircleIcon,
  AtSignIcon,
  CheckCircle2Icon,
  Icon,
  PopcornIcon,
  Star,
  StarIcon,
  Terminal,
} from "lucide-react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
    return <PesquisaError />; /////////////////////////////////////////////////////////////////////////////////////////////////////////
  }
  if (!userSearch || userSearch.items.length === 0) {
    return <Pesquisa404 />; /////////////////////////////////////////////////////////////////////////////////////////////////////////
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
              className="cursor-pointer mr-3 hover:bg-muted transition flex justify-center h-[65px]"
              style={bg5}
            >
              <CardContent className="flex flex-row items-center justify-between gap-4">
                <div className="flex flex-row items-center gap-2 cursor-pointer truncate">
                  <Avatar>
                    <AvatarImage src={user.avatar_url} alt={user.login} />
                    <AvatarFallback>
                      {user.name
                        ? user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : user.login.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
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
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(user);
                  }}
                  className="p-0 y-50 bg-transparent hover:bg-transparent hover:text-yellow-500"
                >
                  <Star
                    className={`w-5 h-5 ${
                      favoriteUsers.some((fav) => fav.login === user.login)
                        ? " stroke-gray-400 fill-accent-foreground"
                        : "text-gray-400"
                    }`}
                  />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <Separator className="my-4 w-full " />
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

///////////////////////////////////////////////////////////////////////////////////////////////

export function PesquisaSkeleton() {
  /* resultados da pesquisa */
  return (
    <div className="w-full">
      <ScrollArea className="h-[600] ">
        <div className="flex flex-col gap-1 mr-3">
          {Array.from({ length: 30 }).map((_, index) => (
            <Card
              key={index}
              className="h-[65px] flex justify-center rounded-md"
            >
              <CardContent className="flex flex-row items-center justify-between gap-4">
                <div className="flex flex-row items-center gap-2">
                  <Skeleton className="size-[36] rounded-full" />
                  <Skeleton className=" w-[300] h-[30] rounded-xl" />
                </div>

                <StarIcon className="size-4 mr-[10px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export function PesquisaError() {
  /* resultados da pesquisa */
  return (
    <div className="flex flex-col w-full  items-center gap-4">
      <Alert variant="destructive" className=" w-[400px] md:w-[600px] mt-15">
        <AlertCircleIcon />
        <AlertTitle className="text-xl">Ops, algo deu errado!</AlertTitle>
        <AlertDescription className="p-6">
          Não conseguimos carregar os resultados da pesquisa. Tente o seguinte:
          <ul className="flex flex-col items-start list-inside list-disc text-sm">
            <li>Aguarde alguns segundos para a API do GitHub responder</li>
            <li>Verifique sua conexão com a internet</li>
            <li>Atualize a página e tente novamente</li>
            <li>Se o problema persistir, tente pesquisar outro usuário</li>
          </ul>
        </AlertDescription>
      </Alert>
      <div className="w-[400px] h-[400px] rounded-full overflow-hidden mx-auto">
        <img
          src="/images/notFound.gif"
          alt="Carregando..."
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export function Pesquisa404() {
  /* usuário não encontrado */
  return (
    <div className="flex flex-col w-full  items-center gap-4">
      <Alert className=" w-[400px] md:w-[600px] mt-15">
        <AlertCircleIcon />
        <AlertTitle className="text-xl">Usuário não encontrado!</AlertTitle>
        <AlertDescription className="p-6">
          Não foi possível encontrar um perfil com esse nome. Tente o seguinte:
          <ul className="flex flex-col items-start list-inside list-disc text-sm">
            <li>Verifique se o nome de usuário está correto</li>
            <li>Tente pesquisar outro usuário do GitHub</li>
            <li>Atualize a página caso tenha ocorrido algum erro temporário</li>
          </ul>
        </AlertDescription>
      </Alert>
      <div className="w-[400px] h-[400px] rounded-full overflow-hidden mx-auto">
        <img
          src="/images/notFound.gif"
          alt="Carregando..."
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
