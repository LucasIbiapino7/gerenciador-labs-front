import {
  Shield,
  ArrowUpCircle,
  ArrowDownCircle,
  Power,
  RefreshCcw,
  Loader2
} from 'lucide-react';
import { useState } from 'react';
import { resolveAsset } from '../../utils/resolveAsset';

function roleLabel(role) {
  switch (role) {
    case 'OWNER': return 'Owner';
    case 'ADMIN': return 'Admin';
    case 'MEMBER':
    default: return 'Membro';
  }
}

function FallbackAvatar({ name }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-lg font-semibold text-gray-600">
      {name?.charAt(0).toUpperCase()}
    </div>
  );
}

export default function MemberManageCard({
  member,
  canPromote,
  canDemote,
  canDeactivate,
  canReactivate,
  onPromote,
  onDemote,
  onDeactivate,
  onReactivate,
  busy,
  flash
}) {
  const {
    id,
    nome,
    photoUrl,
    profileType,
    labRole,
    ativo
  } = member;

  const typeLabel = profileType === 'PROFESSOR' ? 'Professor' : 'Aluno';

  const [broken, setBroken] = useState(false);
  const photo = broken ? '' : resolveAsset(photoUrl);

  return (
    <div
      className={`relative flex flex-col items-center gap-3 rounded-xl bg-white p-4 text-center ring-1 ring-gray-200 shadow-sm transition
        ${flash ? 'ring-2 ring-emerald-400 animate-pulse' : ''}
        ${!ativo ? 'opacity-80' : ''}`}
    >
      <a
        href={`/users/${id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0"
        aria-label={`Abrir perfil público de ${nome} em nova aba`}
        tabIndex={-1}
      />
      <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-white shadow shrink-0">
        {photo ? (
          <img
            src={photo}
            alt={nome}
            className="h-full w-full object-cover"
            draggable={false}
            onError={() => setBroken(true)}
          />
        ) : (
          <FallbackAvatar name={nome} />
        )}
        {!ativo && (
          <span className="absolute -bottom-1 -right-1 rounded bg-red-500 px-1 py-0.5 text-[10px] font-semibold text-white shadow">
            INATIVO
          </span>
        )}
      </div>
      <h4 className="relative z-10 text-sm font-semibold text-gray-900 line-clamp-2">
        {nome}
      </h4>
      <div className="relative z-10 flex flex-wrap justify-center gap-1 text-[11px]">
        <span className="rounded bg-gray-100 px-2 py-0.5 font-medium text-gray-600">
          {typeLabel}
        </span>
        <span
          className={`flex items-center gap-1 rounded px-2 py-0.5 font-medium
            ${
              labRole === 'OWNER'
                ? 'bg-purple-100 text-purple-600'
                : labRole === 'ADMIN'
                ? 'bg-primary/10 text-primary'
                : 'bg-blue-100 text-blue-600'
            }`}
        >
          <Shield className="h-3 w-3" />
          {roleLabel(labRole)}
        </span>
      </div>
      <div className="relative z-10 mt-1 flex flex-wrap justify-center gap-2">
        {canPromote && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); onPromote(); }}
            disabled={busy}
            aria-busy={busy}
            className="group inline-flex items-center gap-1 rounded bg-emerald-500 px-2 py-1 text-xs font-medium text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
            title="Promover para Admin"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUpCircle className="h-4 w-4" />}
            Promover
          </button>
        )}

        {canDemote && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); onDemote(); }}
            disabled={busy}
            aria-busy={busy}
            className="group inline-flex items-center gap-1 rounded bg-amber-500 px-2 py-1 text-xs font-medium text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
            title="Rebaixar para Membro"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowDownCircle className="h-4 w-4" />}
            Rebaixar
          </button>
        )}

        {canDeactivate && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); onDeactivate(); }}
            disabled={busy}
            aria-busy={busy}
            className="group inline-flex items-center gap-1 rounded bg-red-500 px-2 py-1 text-xs font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-400/50"
            title="Desativar"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Power className="h-4 w-4" />}
            Desativar
          </button>
        )}

        {canReactivate && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); onReactivate(); }}
            disabled={busy}
            aria-busy={busy}
            className="group inline-flex items-center gap-1 rounded bg-sky-500 px-2 py-1 text-xs font-medium text-white hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-sky-400/50"
            title="Reativar"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            Reativar
          </button>
        )}

        {!canPromote && !canDemote && !canDeactivate && !canReactivate && (
          <span className="text-[11px] text-gray-400">Sem ações</span>
        )}
      </div>
    </div>
  );
}
