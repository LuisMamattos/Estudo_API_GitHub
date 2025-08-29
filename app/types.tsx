export interface User {
  login: string;
  avatar_url: string;
  name?: string | null;
  bio?: string | null;
  email?: string | null;
  location?: string | null;
  html_url?: string;
  public_repos: number;
}
export interface Repo {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  html_url: string;
  owner?: {
    login: string;
  };
}
