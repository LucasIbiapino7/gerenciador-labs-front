import { useOutletContext } from 'react-router-dom';
import { useState, useMemo } from 'react';

import MembrosFiltros from '../components/Membro/MembrosFiltros';
import MembrosContainer from '../components/Membro/MembrosContainer';

import { listarMembrosLab } from '../services/MembroService';
import useDebounce from '../hooks/useDebounce';
import { usePaginatedFetch } from '../hooks/usePaginatedFetch';
import PaginationBar from '../components/Pagination/PaginationBar';

export default function LabMembros() {
  const { labId, admin } = useOutletContext();

  const [filters, setFilters] = useState({ q: '', role: 'all' });
  const debouncedNome = useDebounce(filters.q, 700); // 
  const fetcher = useMemo(
    () => async ({ page, size }) =>
      listarMembrosLab(labId, {
        nome: debouncedNome,
        page,
        size,
      }),
    [labId, debouncedNome]
  );

  const {
    items: membros,
    page,
    size,
    totalPages,
    totalElements,
    loading,
    error,
    setPage,
    reload
  } = usePaginatedFetch({
    fetcher,
    initialPage: 0,
    initialSize: 3, 
    deps: [labId, debouncedNome],
    auto: true
  });

  if (loading && membros.length === 0) return <p>Carregando membros…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const visibles = membros.filter(
    (m) => filters.role === 'all' || m.role === filters.role
  );

  return (
    <div className="space-y-6">
      <MembrosFiltros
        filters={filters}
        setFilters={setFilters}
      />

      <MembrosContainer
        items={visibles}
        isAdmin={admin}
      />

      <PaginationBar
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <p className="text-xs text-gray-500">
        Mostrando {(page * size) + 1} – {Math.min((page + 1) * size, totalElements)} de {totalElements}
      </p>
    </div>
  );
}
