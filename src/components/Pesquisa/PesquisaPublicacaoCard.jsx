import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PesquisaPublicacaoCard({ item }) {
  const { id, titulo, ano, doi, issnIsbnSigla, author } = item;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-1">
        <span className="rounded bg-emerald-100 px-2 py-0.5 font-medium text-emerald-700">
          Publicação
        </span>
        <span>{ano}</span>
        {issnIsbnSigla && (
          <span className="rounded bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
            {issnIsbnSigla}
          </span>
        )}
      </div>

      <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
        {titulo}
      </h3>

      {author && (
        <div className="mb-2 text-xs text-gray-600">
          Autor:{' '}
          <Link
            to={`/users/${author.id}`}
            className="font-medium text-primary hover:underline"
          >
            {author.nome}
          </Link>
        </div>
      )}

      {doi && (
        <a
          href={`https://doi.org/${doi}`}
            target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          DOI: {doi} <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}
