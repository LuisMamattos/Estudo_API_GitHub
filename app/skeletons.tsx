import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Pin, Star as StarIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
              <Pin className="size-5 mr-2 fill-gray-200 stroke-gray-200" />
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
