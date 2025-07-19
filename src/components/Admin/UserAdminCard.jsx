import { useState, useMemo } from 'react';
import { resolveAsset } from '../../utils/resolveAsset';

const roleBadgeMap = {
  PROFESSOR: 'bg-indigo-100 text-indigo-700',
  ALUNO: 'bg-gray-100 text-gray-600'
};

function FallbackAvatar({ name, profileType }) {
  const initial = (name || '?').charAt(0).toUpperCase();
  const bg =
    profileType === 'PROFESSOR'
      ? 'bg-amber-500'
      : profileType === 'ALUNO'
        ? 'bg-cyan-500'
        : 'bg-gray-500';
  return (
    <span className={`${bg} flex h-full w-full items-center justify-center rounded-full text-sm font-semibold text-white select-none`}>
      {initial}
    </span>
  );
}

export default function UserAdminCard({
  user,
  onSetProfessor,
  onSetAluno,
  busy = false
}) {
  const { nome, profileType, photoUrl, bio, idLattes } = user;
  const isProfessor = profileType === 'PROFESSOR';

  const normalizedPhoto = useMemo(() => resolveAsset(photoUrl), [photoUrl]);
  const [broken, setBroken] = useState(false);
  const showImg = normalizedPhoto && !broken;

  return (
    <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-full ring-1 ring-gray-200">
          {showImg ? (
            <img
              src={normalizedPhoto}
              alt={nome}
              className="h-full w-full object-cover"
              onError={() => setBroken(true)}
              draggable={false}
            />
          ) : (
            <FallbackAvatar name={nome} profileType={profileType} />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-800">{nome}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span
              className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                roleBadgeMap[profileType] || 'bg-gray-100 text-gray-600'
              }`}
            >
              {profileType}
            </span>
            {idLattes && (
              <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                Lattes
              </span>
            )}
          </div>
        </div>
      </div>

      {bio && (
        <p className="mt-3 line-clamp-2 text-[11px] text-gray-500">{bio}</p>
      )}

      <div className="mt-4 flex gap-2">
        {!isProfessor && (
          <button
            onClick={() => onSetProfessor?.(user)}
            disabled={busy}
            aria-label="Definir como Professor"
            className="flex-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90 disabled:opacity-50"
          >
            {busy ? '...' : 'Definir como Professor'}
          </button>
        )}
        {isProfessor && (
          <button
            onClick={() => onSetAluno?.(user)}
            disabled={busy}
            aria-label="Definir como Aluno"
            className="flex-1 rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 disabled:opacity-50"
          >
            {busy ? '...' : 'Definir como Aluno'}
          </button>
        )}
      </div>
    </div>
  );
}
