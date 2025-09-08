"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Repo } from "@/app/types";

interface FavoritesContextType {
  favoriteUsers: User[];
  favoriteRepos: Repo[];
  toggleFavorite: (user: User) => void;
  toggleFavoriteR: (repo: Repo) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteUsers, setFavoriteUsers] = useState<User[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("favoriteUsers");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  const [favoriteRepos, setFavoriteRepos] = useState<Repo[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("favoriteRepos");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  // carregar do localStorage
  useEffect(() => {
    const storedUsers = localStorage.getItem("favoriteUsers");
    const storedRepos = localStorage.getItem("favoriteRepos");

    if (storedUsers) setFavoriteUsers(JSON.parse(storedUsers));
    if (storedRepos) setFavoriteRepos(JSON.parse(storedRepos));
  }, []);

  // salvar no localStorage
  useEffect(() => {
    localStorage.setItem("favoriteUsers", JSON.stringify(favoriteUsers));
  }, [favoriteUsers]);

  useEffect(() => {
    localStorage.setItem("favoriteRepos", JSON.stringify(favoriteRepos));
  }, [favoriteRepos]);

  function toggleFavorite(user: User) {
    setFavoriteUsers((prev) =>
      prev.some((fav) => fav.login === user.login)
        ? prev.filter((fav) => fav.login !== user.login)
        : [...prev, user]
    );
  }

  function toggleFavoriteR(repo: Repo) {
    setFavoriteRepos((prev) =>
      prev.some((fav) => fav.id === repo.id)
        ? prev.filter((fav) => fav.id !== repo.id)
        : [...prev, repo]
    );
  }

  return (
    <FavoritesContext.Provider
      value={{ favoriteUsers, favoriteRepos, toggleFavorite, toggleFavoriteR }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error("useFavorites precisa estar dentro de FavoritesProvider");
  return ctx;
}
