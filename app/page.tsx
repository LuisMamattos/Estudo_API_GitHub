"use client";

import { Suspense } from "react";
import { useQueryState, parseAsString, parseAsInteger } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import { SearchResults, PesquisaSkeleton } from "./searchResults";
import { searchUsersQuery } from "@/lib/query-options";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  const [username] = useQueryState("username", parseAsString.withDefault(""));
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const perPage = 30;

  const queryOptions = searchUsersQuery(username, page, perPage);

  const { data: userSearch, isLoading: userLoading } = useQuery({
    ...queryOptions,
    enabled: username.trim() !== "",
  });

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex justify-between text-center w-full">
        <div className="w-full">
          <h1 className="font-bold mb-4 text-4xl">Usuários Encontrados</h1>
          <Separator className="my-4 w-full " />
          <div className="flex">
            <Suspense fallback={<PesquisaSkeleton />}>
              <SearchResults
                page={page}
                setPage={setPage}
                total={userSearch?.total ?? 0}
                perPage={perPage}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
