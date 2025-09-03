import { User, Repo } from "@/app/types";

const tempo_da_cache_na_mamoria = 1000 * 60 * 10;
const duracao_pra_atualizar_a_cache = 1000 * 60 * 2;
export const usersQuery = (
  username: string,
  page = 1,
  perPage = 30,
  setTotal?: (total: number) => void
) => ({
  queryKey: ["searchUsers", username, page, perPage],
  queryFn: async () => {
    if (!username) return [];
    const res = await fetch(
      `/api/search/users?q=${encodeURIComponent(
        username
      )}&page=${page}&per_page=${perPage}`
    );
    if (!res.ok) throw new Error("Erro ao buscar usuários");
    const json = await res.json();

    // se quiser atualizar um estado externo (como total de resultados)
    if (setTotal) setTotal(json.total);

    return json.items;
  },
  enabled: !!username, // só busca se username existir
  staleTime: duracao_pra_atualizar_a_cache,
  cacheTime: tempo_da_cache_na_mamoria, // 1h na memória
  placeholderData: (prev: User[] | undefined) => prev,
});
export const userProfileQuery = (username: string) => ({
  queryKey: ["user", username],
  queryFn: async () => {
    const res = await fetch(`/api/users/${username}`);
    if (!res.ok) throw new Error(`Erro ao buscar perfil: ${username}`);
    return res.json();
  },
  staleTime: duracao_pra_atualizar_a_cache,
  cacheTime: tempo_da_cache_na_mamoria,
  placeholderData: (prev: User | undefined) => prev, ///////////
});

export const userReposQuery = (username: string, page = 1, perPage = 30) => ({
  queryKey: ["repos", username, page, perPage],
  queryFn: async () => {
    const res = await fetch(
      `/api/users/${username}/repos?page=${page}&per_page=${perPage}`
    );
    if (!res.ok) throw new Error(`Erro ao buscar repositórios de ${username}`);
    return res.json();
  },
  staleTime: duracao_pra_atualizar_a_cache,
  cacheTime: tempo_da_cache_na_mamoria,
  placeholderData: (prev: Repo[] | undefined) => prev,
});
