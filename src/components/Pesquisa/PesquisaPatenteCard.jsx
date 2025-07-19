function formatData(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('pt-BR');
}

export default function PesquisaPatenteCard({ item }) {
  const { titulo, codigo, dataDeposito } = item;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-1">
        <span className="rounded bg-amber-100 px-2 py-0.5 font-medium text-amber-700">
          Patente
        </span>
        {dataDeposito && (
          <span className="rounded bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
            Depósito: {formatData(dataDeposito)}
          </span>
        )}
      </div>

      <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
        {titulo}
      </h3>

      {codigo && (
        <p className="text-[11px] font-mono text-gray-600">
          Código: <span className="font-medium">{codigo}</span>
        </p>
      )}
    </div>
  );
}
