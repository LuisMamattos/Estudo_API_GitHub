import { z } from "zod";

/** Usuário (item do search) */
export const UserLiteSchema = z.object({
  id: z.number(),
  login: z.string(),
  avatar_url: z.string().url(),
  html_url: z.string().url(),
});

/** Response do /search/users */
export const SearchUsersResponseSchema = z.object({
  total_count: z.number(),
  incomplete_results: z.boolean(),
  items: z.array(UserLiteSchema),
});

/** Perfil completo (o que você realmente usa na UI) */
export const UserProfileSchema = z.object({
  id: z.number(),
  login: z.string(),
  name: z.string().nullable().optional(),
  avatar_url: z.string().url(),
  html_url: z.string().url(),
  bio: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  location: z.string().nullable().optional(),
  public_repos: z.number(), // usado na paginação
});

/** Repositório (campos usados na UI) */
export const RepoSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  stargazers_count: z.number(),
  forks_count: z.number(),
  language: z.string().nullable(),
  html_url: z.string().url(),
});

export type UserLite = z.infer<typeof UserLiteSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type Repo = z.infer<typeof RepoSchema>;
