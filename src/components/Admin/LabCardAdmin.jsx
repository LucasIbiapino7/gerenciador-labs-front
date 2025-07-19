import React from 'react';

export default function LabCardAdmin({ lab, onChangeOwner }) {
  return (
    <div className="relative flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-br from-primary/20 to-primary/5 text-sm font-semibold text-primary">
          {lab.nome.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="font-semibold leading-tight text-gray-800">
            {lab.nome}
          </h3>
            <p className="line-clamp-2 text-xs text-gray-500">
            {lab.descricaoCurta}
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-3 text-[11px] text-gray-600">
        <div>
          <span className="block font-medium text-gray-700">Membros</span>
          <span>{lab.totalMembros}</span>
        </div>
        <div>
          <span className="block font-medium text-gray-700">Owner</span>
          {lab.owner ? (
            <span className="text-xs">
              {lab.owner.nome}
              {lab.owner.email && (
                <span className="text-gray-400"> ({lab.owner.email})</span>
              )}
            </span>
          ) : (
            <span className="italic text-gray-400">— não definido —</span>
          )}
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={() => onChangeOwner?.(lab)}
          className="rounded-md border border-primary px-3 py-1 text-xs font-medium text-primary transition hover:bg-primary/5"
        >
          {lab.owner ? 'Alterar Owner' : 'Definir Owner'}
        </button>
      </div>
    </div>
  );
}
