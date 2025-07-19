import { Plus } from 'lucide-react';

export default function MaterialFiltros({ filters, setFilters, isAdmin, onAdd }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Buscar material…"
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          className="rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
        />
        <select
          value={filters.tipo}
          onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
          className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-primary"
        >
          <option value="all">Todos os tipos</option>
          <option value="pdf">PDF</option>
          <option value="slide">Slides</option>
          <option value="video">Vídeos</option>
          <option value="repositorio">Repositórios</option>
        </select>
      </div>
      {isAdmin && (
        <button
          onClick={onAdd}
          className="flex items-center gap-1 rounded bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Adicionar material
        </button>
      )}
    </div>
  );
}
