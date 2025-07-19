import { useState } from 'react';
import { Plus } from 'lucide-react';
import { resolveAsset } from '../../utils/resolveAsset';

function FallbackAvatar({ name }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-lg font-semibold text-gray-600">
      {name?.charAt(0).toUpperCase()}
    </div>
  );
}

export default function CandidateCard({ user, onAdd, disabled, adding }) {
  const [broken, setBroken] = useState(false);
  const photo = broken ? '' : resolveAsset(user.photoUrl);

  return (
    <div className="relative flex flex-col items-center gap-3 rounded-xl bg-white p-4 text-center ring-1 ring-gray-200 shadow-sm">
      <a
        href={`/users/${user.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0"
        aria-label={`Abrir perfil público de ${user.nome} em nova aba`}
        tabIndex={-1}
      />
      <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-white shadow shrink-0">
        {photo ? (
          <img
            src={photo}
            alt={user.nome}
            className="h-full w-full object-cover"
            onError={() => setBroken(true)}
            draggable={false}
          />
        ) : (
          <FallbackAvatar name={user.nome} />
        )}
      </div>

      <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 relative z-10">
        {user.nome}
      </h4>

      <span className="relative z-10 rounded bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
        {user.role === 'PROFESSOR' ? 'Professor' : 'Aluno'}
      </span>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onAdd(); }}
        disabled={disabled}
        className="relative z-10 mt-auto flex items-center gap-1 rounded bg-primary px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <Plus className="h-4 w-4" />
        {adding ? 'Adicionando…' : 'Adicionar'}
      </button>
    </div>
  );
}
