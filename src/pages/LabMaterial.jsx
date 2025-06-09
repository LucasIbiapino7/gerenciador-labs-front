import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import MaterialFiltros from '../components/Material/MaterialFiltros';
import MaterialContainer from '../components/Material/MaterialContainer';

const materialsMock = [
  {
    id: 1,
    titulo: 'Relatório Projeto X',
    url: '',
    tipo: 'pdf',
    descricao: 'Versão final aprovada.',
    visibilidade: 'PUBLICO',
  },
  {
    id: 2,
    titulo: 'Slides Aula Clean Code',
    url: '',
    tipo: 'slide',
    descricao: '',
    visibilidade: 'PUBLICO',
  },
  {
    id: 3,
    titulo: 'Repositório Projeto Y',
    url: '',
    tipo: 'repo',
    descricao: '',
    visibilidade: 'PRIVADO',
  },
];

export default function LabMaterial() {
  const { labId, isMember, isAdmin } = useOutletContext();
  const [materiais, setMateriais] = useState([]);
  const [filters, setFilters] = useState({ q: '', tipo: 'all' });

  useEffect(() => {

    setMateriais(materialsMock);
  }, [labId]);

  const visibles = materiais
    .filter((m) => filters.tipo === 'all' || m.tipo === filters.tipo)
    .filter((m) => m.titulo.toLowerCase().includes(filters.q.toLowerCase()))
    .filter((m) => m.visibilidade === 'PUBLICO' || isMember);

  return (
    <div className="space-y-6">
      <MaterialFiltros
        filters={filters}
        setFilters={setFilters}
        isAdmin={isAdmin}
      />

      <MaterialContainer items={visibles} isAdmin={isAdmin} />
    </div>
  );
}
