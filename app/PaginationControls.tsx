"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  setPage: (p: number) => void;
  total: number;
  perPage: number;
  maxPagesToShow?: number; // opcional, default 5
}

export default function PaginationControls({
  page,
  setPage,
  total,
  perPage,
  maxPagesToShow = 5,
}: PaginationProps) {
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  // Função para calcular quais páginas mostrar
  const getVisiblePages = () => {
    const pages = [];
    const half = Math.floor(maxPagesToShow / 2);
    let start = Math.max(page - half, 1);
    const end = Math.min(start + maxPagesToShow - 1, totalPages);

    start = Math.max(end - maxPagesToShow + 1, 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      <Pagination>
        <PaginationContent>
          {/* Anterior */}
          <PaginationItem>
            <PaginationLink
              onClick={() => page > 1 && setPage(page - 1)}
              className={page === 1 ? "opacity-50 pointer-events-none" : ""}
            >
              <ChevronLeft />
            </PaginationLink>
          </PaginationItem>

          {/* Primeira página + ... se necessário */}
          {visiblePages[0] > 1 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => setPage(1)}>1</PaginationLink>
              </PaginationItem>
              {visiblePages[0] > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}

          {/* Páginas visíveis */}
          {visiblePages.map((p) => (
            <PaginationItem key={p}>
              <PaginationLink isActive={p === page} onClick={() => setPage(p)}>
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Próxima */}
          <PaginationItem>
            <PaginationLink
              onClick={() => page < totalPages && setPage(page + 1)}
              className={
                page === totalPages ? "opacity-50 pointer-events-none" : ""
              }
            >
              <ChevronRight />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
        {/* Info de total de páginas e resultados */}
      </Pagination>
      <div className="text-sm text-muted-foreground">
        Página {page} de {totalPages} | Exibindo [{start}–{end}] de {total}{" "}
        resultados
      </div>
    </div>
  );
}
