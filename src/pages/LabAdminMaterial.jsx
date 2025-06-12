import { useState } from 'react';
import MaterialContainer from '../components/Material/MaterialContainer';
import MaterialFiltros from '../components/Material/MaterialFiltros';
import MaterialModal from '../components/Material/MaterialModal';

const MOCK_MATERIAIS = [
  {
    id: 1,
    titulo: 'Apostila de Algoritmos',
    descricao: 'PDF completo sobre lógica de programação.',
    url: 'https://example.com/algoritmos.pdf',
    tipo: 'pdf',
    visibilidade: 'PUBLICO',
  },
  {
    id: 2,
    titulo: 'Slides Semana 1',
    descricao: 'Introdução ao curso e ferramentas.',
    url: 'https://example.com/slides.pdf',
    tipo: 'slide',
    visibilidade: 'PUBLICO',
  },
  {
    id: 3,
    titulo: 'Repositório Exemplo',
    descricao: 'Código base do projeto.',
    url: 'https://github.com/ufma-labs/projeto-base',
    tipo: 'repo',
    visibilidade: 'PRIVADO',
  },
];

export default function LabAdminMaterial() {
  const [materiais, setMateriais] = useState(MOCK_MATERIAIS);
  const [filters, setFilters] = useState({ q: '', tipo: 'all' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = materiais.filter((m) => {
    const matchesTipo = filters.tipo === 'all' || m.tipo === filters.tipo;
    const matchesSearch = m.titulo.toLowerCase().includes(filters.q.toLowerCase());
    return matchesTipo && matchesSearch;
  });

  const handleSave = (form) => {
    if (form.id) {
      setMateriais((prev) => prev.map((m) => (m.id === form.id ? form : m)));
    } else {
      setMateriais((prev) => [...prev, { ...form, id: Date.now() }]);
    }
    setModalOpen(false);
    setEditing(null);
  };

  const handleEdit = (item) => {
    setEditing(item);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <MaterialFiltros filters={filters} setFilters={setFilters} isAdmin onAdd={handleAdd} />
      <MaterialContainer items={filtered} isAdmin onEdit={handleEdit} />
      <MaterialModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
        initialData={editing}
      />
    </div>
  );
}
