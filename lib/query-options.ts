import { User, Repo } from "@/app/types";

const tempo_da_cache_na_mamoria = 1000 * 60 * 10;
const duracao_pra_atualizar_a_cache = 1000 * 60 * 2;
///////////////////////////////////////////////////////////////////////////////////////////
export const searchUsersQuery = (username: string, page = 1, perPage = 30) => ({
  queryKey: ["users", "search", { username, page, perPage }],
  queryFn: async () => {
    const res = await fetch(
      `/api/search/users?q=${encodeURIComponent(
        username
      )}&page=${page}&per_page=${perPage}`
    );
    if (!res.ok) throw new Error("Erro ao buscar usuários");
    return res.json() as Promise<{
      items: User[];
      total: number;
    }>;
  },
  enabled: !!username, // só busca se username existir
  //staleTime: duracao_pra_atualizar_a_cache,
  //cacheTime: tempo_da_cache_na_mamoria, //
  //placeholderData: (prev: User[] | undefined) => prev,
});
///////////////////////////////////////////////////////////////////////////////////////////
export const userProfileQuery = (username: string) => ({
  queryKey: ["users", username],
  queryFn: async () => {
    const res = await fetch(`/api/users/${username}`);
    if (!res.ok) throw new Error(`Erro ao buscar perfil: ${username}`);
    return res.json();
  },
  staleTime: duracao_pra_atualizar_a_cache,
  cacheTime: tempo_da_cache_na_mamoria,
  //placeholderData: (prev: User | undefined) => prev, ///////////
});

///////////////////////////////////////////////////////////////////////////////////////////
export const userReposQuery = (username: string, page = 1, perPage = 30) => ({
  queryKey: ["repos", { username, page, perPage }],

  queryFn: async () => {
    const res = await fetch(
      `/api/users/${username}/repos?page=${page}&per_page=${perPage}`
    );
    if (!res.ok) throw new Error(`Erro ao buscar repositórios de ${username}`);
    return res.json();
  },
  //staleTime: duracao_pra_atualizar_a_cache,
  //cacheTime: tempo_da_cache_na_mamoria,
  //placeholderData: (prev: Repo[] | undefined) => prev,
});
///////////////////////////////////////////////////////////////////////////////////////////
export const favoriteUserReposQuery = (
  username: string,
  page = 1,
  perPage = 30
) => ({
  queryKey: ["repos", "stargazers", { username, page, perPage }],
  queryFn: async (): Promise<Repo[]> => {
    const res = await fetch(
      `/api/users/${username}/repos?page=${page}&per_page=${perPage}`
    );
    if (!res.ok) throw new Error(`Erro ao buscar repositórios de ${username}`);
    const data: Repo[] = await res.json();
    // ordenar por estrelas decrescente
    return data.sort((a, b) => b.stargazers_count - a.stargazers_count);
  },
  //staleTime: duracao_pra_atualizar_a_cache,
  //cacheTime: tempo_da_cache_na_mamoria,
});
///////////////////////////////////////////////////////////////////////////////////////////
