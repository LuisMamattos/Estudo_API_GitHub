"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode, Suspense, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { FavoritesProvider } from "@/app/context/FavoritesContext";

const queryClient = new QueryClient();
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <SidebarProvider>
          <FavoritesProvider>
            <Suspense fallback={<div>Carregando...</div>}>{children}</Suspense>
          </FavoritesProvider>
        </SidebarProvider>
      </NuqsAdapter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
