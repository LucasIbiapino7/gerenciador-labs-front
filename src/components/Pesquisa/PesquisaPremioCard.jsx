export default function PesquisaPremioCard({ item }) {
  const { ano, nomePremio, entidade } = item;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-1">
        <span className="rounded bg-fuchsia-100 px-2 py-0.5 font-medium text-fuchsia-700">
          Prêmio
        </span>
        <span>{ano}</span>
      </div>

      <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-3">
        {nomePremio}
      </h3>

      {entidade && (
        <p className="text-[11px] font-medium text-gray-600">{entidade}</p>
      )}
    </div>
  );
}
