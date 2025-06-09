export default function MembrosFiltros({ filters, setFilters }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <input
        type="text"
        placeholder="Buscar por nome…"
        value={filters.q}
        onChange={(e) => setFilters({ ...filters, q: e.target.value })}
        className="w-48 rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
      />

      <select
        value={filters.role}
        onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-primary"
      >
        <option value="all">Todos</option>
        <option value="professor">Professores</option>
        <option value="aluno">Alunos</option>
      </select>
    </div>
  );
}
