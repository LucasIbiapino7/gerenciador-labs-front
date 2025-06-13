import { ExternalLink } from 'lucide-react';

const badgeMap = {
  ARTIGO: 'bg-emerald-100 text-emerald-700',
  ORIENTACAO: 'bg-indigo-100 text-indigo-700',
  PROJETO: 'bg-fuchsia-100 text-fuchsia-700',
};

export default function PesquisaCard({ item }) {
  const { titulo, ano, tipo, resumo, url, autores } = item;
  return (
    <div className="space-y-2 rounded-xl bg-white p-5 border border-primary shadow hover:shadow-md">
      <div className="flex flex-wrap items-center gap-3">
        <span className={`rounded px-2 py-0.5 text-xs font-medium ${badgeMap[tipo] || 'bg-gray-100 text-gray-700'}`}>{tipo}</span>
        <span className="text-xs text-gray-500">{ano}</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{titulo}</h3>
      {autores && <p className="text-sm text-gray-600 line-clamp-1">{autores.join(', ')}</p>}
      {resumo && <p className="text-sm text-gray-700 line-clamp-2">{resumo}</p>}
      {url && (
        <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          Acessar <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}
