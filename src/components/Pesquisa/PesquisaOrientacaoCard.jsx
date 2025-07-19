export default function PesquisaOrientacaoCard({ item }) {
  const { ano, titulo, nivel, discente } = item;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-1">
        <span className="rounded bg-indigo-100 px-2 py-0.5 font-medium text-indigo-700">
          Orientação
        </span>
        <span>{ano}</span>
        {nivel && (
          <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] tracking-tight text-gray-600">
            {nivel}
          </span>
        )}
      </div>

      <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
        {titulo}
      </h3>

      {discente && (
        <p className="text-xs text-gray-600">
          Discente: <span className="font-medium">{discente}</span>
        </p>
      )}
    </div>
  );
}
