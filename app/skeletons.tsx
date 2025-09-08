import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star as StarIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function FavoritosSkeleton() {
  /* favoritos do storage */
  return (
    <div className="flex flex-col gap-1">
      <Card className="bg-white rounded-xl w-[235px] p-3 ">
        <CardHeader>
          <CardTitle className="flex items-center text-center text-gray-200 text-lg font-bold">
            <StarIcon className="size-5 mr-2 fill-gray-200 stroke-gray-200" />
            Perfis
          </CardTitle>
        </CardHeader>

        <CardContent className="rounded-xl p-0 w-[210px] h-[200px] overflow-y-auto flex flex-col gap-2">
          <Skeleton className="h-[50px]  p-3 rounded-xl" />
          <Skeleton className="h-[50px]  p-3 rounded-xl" />
          <Skeleton className="h-[50px]  p-3 rounded-xl" />
        </CardContent>
      </Card>

      <Card className="bg-white rounded-xl w-[235px] p-3">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-200 text-center text-lg font-bold">
            <StarIcon className="size-5 mr-2 fill-gray-200 stroke-gray-200" />
            Repositórios
          </CardTitle>
        </CardHeader>

        <CardContent className="rounded-xl p-0 w-[210px] h-[200px] overflow-y-auto flex flex-col gap-2">
          <Skeleton className="h-[75px]  p-3 rounded-xl" />
          <Skeleton className="h-[75px]  p-3 rounded-xl" />
        </CardContent>
      </Card>
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

export function RepositoriosSkeleton() {
  /* repositorios */
  return (
    <div className="flex flex-col w-full items-center">
      <div className="grid gap-1 font-semibold h-[720px] w-full overflow-y-auto">
        {Array.from({ length: 30 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex justify-between items-center">
              <Skeleton className="h-[20px] w-[150px]  rounded-xl" />
              <StarIcon className="size-5 mr-2 fill-gray-200 stroke-gray-200" />
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
