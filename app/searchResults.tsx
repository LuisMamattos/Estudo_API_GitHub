import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AtSignIcon, Star } from "lucide-react";
import PaginationControls from "@/app/PaginationControls";
import { User } from "@/app/types";
import { bg5 } from "@/app/estilos";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { userProfileQuery } from "@/lib/query-options";

export default function SearchResults({
  users,
  page,
  setPage,
  total,
  perPage,
  favoriteUsers,
  toggleFavorite,
}: {
  users: User[];
  page: number;
  setPage: (p: number) => void;
  total: number;
  perPage: number;
  favoriteUsers: User[];
  toggleFavorite: (user: User) => void;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  return (
    <div className="w-[700px] h-[820px]">
      <div className="flex flex-col gap-1 w-full h-[700px] overflow-auto">
        {users.map((user) => (
          <Card
            key={user.login}
            onClick={async () => {
              // baixa e coloca o perfil completo no cache, com as configs do userProfileQuery
              await queryClient.prefetchQuery(userProfileQuery(user.login));

              // navega sem reload
              router.push(`/github/user/${user.login}`);
            }}
            className="cursor-pointer hover:bg-muted transition"
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
