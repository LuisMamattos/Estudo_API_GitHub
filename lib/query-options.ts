export const usersQuery = (username: string, page = 1, perPage = 30) => ({
  queryKey: ["users", username, page, perPage],
  queryFn: () =>
    fetch(
      `/api/search/users?q=${encodeURIComponent(
        username
      )}&page=${page}&per_page=${perPage}`
    ).then((res) => {
      if (!res.ok) throw new Error("Erro ao buscar usuários");
      return res.json();
    }),
});

export const userProfileQuery = (username: string) => ({
  queryKey: ["user", username],
  queryFn: () =>
    fetch(`/api/users/${username}`).then((res) => {
      if (!res.ok) throw new Error("Erro ao buscar perfil");
      return res.json();
    }),
});

export const userReposQuery = (username: string, page = 1, perPage = 30) => ({
  queryKey: ["repos", username, page, perPage],
  queryFn: () =>
    fetch(`/api/users/${username}/repos?page=${page}&per_page=${perPage}`).then(
      (res) => {
        if (!res.ok) throw new Error("Erro ao buscar repositórios");
        return res.json();
      }
    ),
});
