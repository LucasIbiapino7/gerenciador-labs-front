import { Pencil } from 'lucide-react';
import { isAfter } from 'date-fns';

function ensureDate(v) { return v instanceof Date ? v : new Date(v); }

export default function EventCard({ item, isAdmin, onEdit }) {
  const { lab, author } = item;

  const dt = ensureDate(item.instante ?? item.dataEvento);
  const future = isAfter(dt, new Date());

  const dateStr = dt.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  const timeStr = dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
      <span className="absolute inset-y-0 left-0 w-1 bg-primary" />

      {isAdmin && future && (
        <button
          onClick={() => onEdit?.(item)}
          className="absolute top-2 right-2 rounded bg-white/80 p-1 backdrop-blur"
        >
          <Pencil className="h-4 w-4 text-gray-600" />
        </button>
      )}

      <div className="flex items-start gap-3 p-5 sm:p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg text-white">
          📅
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-baseline gap-2 text-sm text-gray-800">
            <span className="font-medium">
              {dateStr} • {timeStr}
            </span>
            {item.local && <span>• {item.local}</span>}
          </div>

          <h4 className="text-lg font-semibold text-gray-900">{item.titulo}</h4>
          <p className="whitespace-pre-line text-sm text-gray-700">{item.resumo}</p>

          {author?.nome && (
            <div className="pt-1 text-xs text-gray-500">Organizado por {author.nome}</div>
          )}
        </div>

        {lab?.nome && (
          <span className="ml-auto hidden rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary sm:inline">
            {lab.nome}
          </span>
        )}
      </div>
    </div>
  );
}
