// LabMaterial.jsx
import { useOutletContext } from "react-router-dom";
import { useState, useMemo } from "react";

import MaterialFiltros from "../components/Material/MaterialFiltros";
import MaterialContainer from "../components/Material/MaterialContainer";
import MaterialModal from "../components/Material/MaterialModal";

import {
  listarMateriaisLab,
  criarMaterial,
  atualizarMaterial,
} from "../services/MaterialService";

import { useAuth } from "../contexts/AuthContext";
import useDebounce from "../hooks/useDebounce";
import { usePaginatedFetch } from "../hooks/usePaginatedFetch";
import PaginationBarSimple from "../components/Pagination/PaginationBar";

export default function LabMaterial() {
  const { labId, member, admin } = useOutletContext();
  const { isAuthenticated } = useAuth();

  const [filters, setFilters] = useState({ q: "", tipo: "all" });
  const debouncedNome = useDebounce(filters.q, 400);

  const [modalOpen, setModal] = useState(false);
  const [editing, setEdit] = useState(null);
  const [formError, setFError] = useState(null);

  const fetcher = useMemo(
    () => async ({ page, size }) =>
      listarMateriaisLab(labId, isAuthenticated, {
        tipo: filters.tipo,
        nome: debouncedNome,
        page,
        size,
      }),
    [labId, isAuthenticated, filters.tipo, debouncedNome]
  );

  const {
    items: materiais,
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
    initialSize: 12, // fixo
    deps: [labId, isAuthenticated, filters.tipo, debouncedNome],
    auto: true
  });

  const handleAdd = () => {
    setEdit(null);
    setFError(null);
    setModal(true);
  };

  const handleEdit = (item) => {
    setEdit(item);
    setFError(null);
    setModal(true);
  };

  const handleSave = async (form) => {
    try {
      if (form.id) {
        await atualizarMaterial(labId, form.id, form);
        reload({ silent: true });
      } else {
        await criarMaterial(labId, form);
        setPage(0);
      }
      setModal(false);
      setEdit(null);
    } catch (err) {
      if (err.response?.status === 422) {
        const msg =
          err.response.data.errors?.[0]?.message || "Dados inválidos.";
        setFError(msg);
      } else if (err.response?.status === 403) {
        setFError("Você não tem permissão para salvar materiais.");
      } else if (err.response?.status === 404) {
        setFError("Material ou laboratório não encontrado.");
      } else {
        setFError("Erro ao salvar material.");
      }
    }
  };

  if (loading && materiais.length === 0) return <p>Carregando materiais…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const visibles = member
    ? materiais
    : materiais.filter((m) => m.visibilidade === "PUBLICO");

  return (
    <div className="space-y-6">
      <MaterialFiltros
        filters={filters}
        setFilters={setFilters}
        isAdmin={admin}
        onAdd={handleAdd}
      />

      <MaterialContainer
        items={visibles}
        isAdmin={admin}
        onEdit={handleEdit}
      />

      <PaginationBarSimple
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <MaterialModal
        open={modalOpen}
        onClose={() => {
          setModal(false);
          setEdit(null);
        }}
        onSave={handleSave}
        initialData={editing}
        error={formError}
      />

      <p className="text-xs text-gray-500">
        Mostrando {(page * size) + 1} – {Math.min((page + 1) * size, totalElements)} de {totalElements}
      </p>
    </div>
  );
}
