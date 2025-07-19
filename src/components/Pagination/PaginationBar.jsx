import React from 'react';

function range(start, end) {
  const out = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
}

export default function PaginationBarSimple({
  page,
  totalPages,
  disabled = false,
  compact = false,
  onPageChange,
}) {
  if (!totalPages || totalPages <= 1) {
    return (
      <div className="flex items-center text-sm text-gray-500">
        Página 1 de 1
      </div>
    );
  }

  const current = page;
  const lastIndex = totalPages - 1;

  const windowSize = compact ? 3 : 5;
  const start = Math.max(0, current - Math.floor(windowSize / 2));
  const end = Math.min(lastIndex, start + windowSize - 1);
  const realStart = Math.max(0, end - windowSize + 1);
  const pagesToShow = range(realStart, end);

  const showStartEllipsis = pagesToShow[0] > 1;
  const showEndEllipsis = pagesToShow[pagesToShow.length - 1] < lastIndex - 1;

  function goto(p) {
    if (p < 0 || p > lastIndex || p === current || disabled) return;
    onPageChange?.(p);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-gray-200 bg-white p-3 text-sm">
      <div className="flex items-center gap-1">
        <button
          onClick={() => goto(0)}
          disabled={current === 0 || disabled}
          className="px-2 py-1 rounded border text-xs disabled:opacity-40 hover:bg-gray-50"
        >
          «
        </button>
        <button
          onClick={() => goto(current - 1)}
          disabled={current === 0 || disabled}
          className="px-2 py-1 rounded border text-xs disabled:opacity-40 hover:bg-gray-50"
        >
          ‹
        </button>

        {pagesToShow[0] !== 0 && (
          <button
            onClick={() => goto(0)}
            className={`px-3 py-1 rounded border text-xs font-medium hover:bg-primary/10 ${
              current === 0
                ? 'bg-primary text-white border-primary'
                : 'bg-white'
            }`}
          >
            1
          </button>
        )}

        {showStartEllipsis && <span className="px-2 text-gray-400">…</span>}

        {pagesToShow.map(p => (
          <button
            key={p}
            onClick={() => goto(p)}
            className={`px-3 py-1 rounded border text-xs font-medium hover:bg-primary/10 ${
              p === current
                ? 'bg-primary text-white border-primary'
                : 'bg-white'
            }`}
          >
            {p + 1}
          </button>
        ))}

        {showEndEllipsis && <span className="px-2 text-gray-400">…</span>}

        {pagesToShow[pagesToShow.length - 1] !== lastIndex && (
          <button
            onClick={() => goto(lastIndex)}
            className={`px-3 py-1 rounded border text-xs font-medium hover:bg-primary/10 ${
              current === lastIndex
                ? 'bg-primary text-white border-primary'
                : 'bg-white'
            }`}
          >
            {lastIndex + 1}
          </button>
        )}

        <button
          onClick={() => goto(current + 1)}
          disabled={current === lastIndex || disabled}
          className="px-2 py-1 rounded border text-xs disabled:opacity-40 hover:bg-gray-50"
        >
          ›
        </button>
        <button
          onClick={() => goto(lastIndex)}
          disabled={current === lastIndex || disabled}
          className="px-2 py-1 rounded border text-xs disabled:opacity-40 hover:bg-gray-50"
        >
          »
        </button>
      </div>

      <span className="text-gray-500">
        Página {current + 1} de {totalPages}
      </span>
    </div>
  );
}