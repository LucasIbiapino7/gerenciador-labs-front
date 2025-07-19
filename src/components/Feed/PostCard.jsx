import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState, useMemo } from 'react';
import { resolveAsset } from '../../utils/resolveAsset'; 
import InitialAvatar from './InitialAvatar'; 

function ensureDate(v) {
  return v instanceof Date ? v : new Date(v);
}

function AuthorAvatar({ author }) {
  const [broken, setBroken] = useState(false);
  const raw = author?.photoUrl;
  const url = useMemo(() => resolveAsset(raw), [raw]);

  if (!url || broken) {
    return <InitialAvatar name={author?.nome} color="cyan" />;
  }

  return (
    <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow bg-gray-100">
      <img
        src={url}
        alt={author?.nome || 'autor'}
        className="h-full w-full object-cover"
        draggable={false}
        onError={() => setBroken(true)}
      />
    </div>
  );
}

export default function PostCard({ item }) {
  const { author, lab } = item;
  const dt = ensureDate(item.instante);
  const timeAgo = formatDistanceToNow(dt, {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <div className="relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
      <span className="absolute inset-y-0 left-0 w-1 bg-primary" />
      <div className="flex items-start gap-3 p-5 sm:p-6">
        <AuthorAvatar author={author} />

        <div className="flex-1 space-y-1">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-medium text-gray-900">{author?.nome}</span>
              <span className="text-xs text-gray-500">{timeAgo}</span>
              {/* Se quiser mostrar tipo de perfil (ex: PROFESSOR/ALUNO) se vier */}
              {author?.profileType && (
                <span className="ml-1 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
                  {author.profileType === 'PROFESSOR' ? 'Professor' : 'Aluno'}
                </span>
              )}
            </div>

            {item.titulo && (
              <h4 className="font-semibold text-gray-900">
                {item.titulo}
              </h4>
            )}

            {item.resumo && (
              <p className="whitespace-pre-line text-sm text-gray-700">
                {item.resumo}
              </p>
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
