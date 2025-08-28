"use client";
import { Button } from "@/components/ui/button";

export default function PaginationControls({
  page,
  setPage,
  total,
  perPage,
}: {
  page: number;
  setPage: (p: number) => void;
  total: number;
  perPage: number;
}) {
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Anterior
        </Button>
        <span>
          Página {page} de {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Próxima
        </Button>
      </div>
      <span className="text-sm text-muted-foreground">
        Exibindo {start}–{end} de {total} resultados
      </span>
    </div>
  );
}
