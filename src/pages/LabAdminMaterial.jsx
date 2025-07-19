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

import useDebounce from "../hooks/useDebounce";
import { usePaginatedFetch } from "../hooks/usePaginatedFetch";
import PaginationBar from "../components/Pagination/PaginationBar";

export default function LabAdminMaterial() {
  const { labId } = useOutletContext();

  const [filters, setFilters] = useState({ q: "", tipo: "all" });
  const debouncedNome = useDebounce(filters.q, 400);

  const [modalOpen, setModal] = useState(false);
  const [editing, setEdit] = useState(null);
  const [formError, setFormError] = useState(null);

  const fetcher = useMemo(
    () => async ({ page, size }) =>
      listarMateriaisLab(labId, true, {
        tipo: filters.tipo,
        nome: debouncedNome,
        page,
        size,
      }),
    [labId, filters.tipo, debouncedNome]
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
    setSize,
    reload
  } = usePaginatedFetch({
    fetcher,
    initialPage: 0,
    initialSize: 2, // teste -> depois 12
    deps: [labId, filters.tipo, debouncedNome],
    auto: true
  });

  function handleAdd() {
    setEdit(null);
    setFormError(null);
    setModal(true);
  }

  function handleEdit(item) {
    setEdit(item);
    setFormError(null);
    setModal(true);
  }

  async function handleSave(form) {
    try {
      setFormError(null);
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
      console.error(err);
      if (err.response?.status === 422) {
        const msg =
          err.response.data.errors?.[0]?.message || "Dados inválidos.";
        setFormError(msg);
      } else if (err.response?.status === 403) {
        setFormError("Você não tem permissão para salvar materiais.");
      } else if (err.response?.status === 404) {
        setFormError("Material ou laboratório não encontrado.");
      } else {
        setFormError("Erro ao salvar material.");
      }
    }
  }

  if (loading && materiais.length === 0) return <p>Carregando materiais…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const filtrados = materiais; // backend já veio filtrado

  return (
    <div className="space-y-6">
      <MaterialFiltros
        filters={filters}
        setFilters={setFilters}
        isAdmin={true}
        onAdd={handleAdd}
      />

      <MaterialContainer
        items={filtrados}
        isAdmin={true}
        onEdit={handleEdit}
      />

      <PaginationBar
        page={page}
        totalPages={totalPages}
        size={size}
        onPageChange={setPage}
        onSizeChange={setSize}
        sizeOptions={[2, 12, 24]}
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
