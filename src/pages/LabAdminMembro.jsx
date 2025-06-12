import { useState } from 'react';
import MembrosFiltros from '../components/Membro/MembrosFiltros';
import MembroAdminCard from '../components/Membro/MembroAdminCard';

const MOCK_CANDIDATOS = [
  { id: 1, nome: 'Aluno 1', role: 'aluno', photoUrl: '' },
  { id: 2, nome: 'ALuno 2', role: 'aluno', photoUrl: '' },
  { id: 3, nome: 'Professor 1', role: 'professor', photoUrl: '' },
  { id: 4, nome: 'Aluno 3', role: 'aluno', photoUrl: '' },
  { id: 5, nome: 'Professoor 2', role: 'professor', photoUrl: '' },
];

export default function LabAdminMembro() {
  const [candidatos, setCandidatos] = useState(MOCK_CANDIDATOS);
  const [filters, setFilters] = useState({ q: '', role: 'all' });

  const filtrados = candidatos.filter((c) => {
    const matchRole = filters.role === 'all' || c.role === filters.role;
    const matchNome = c.nome.toLowerCase().includes(filters.q.toLowerCase());
    return matchRole && matchNome;
  });

  const handleAdd = (user) => {
    setCandidatos((prev) => prev.filter((c) => c.id !== user.id));
    console.log('Adicionar membro', user);
  };

  return (
    <div className="space-y-8">
      <MembrosFiltros filters={filters} setFilters={setFilters} />
      {filtrados.length ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtrados.map((u) => (
            <MembroAdminCard key={u.id} user={u} onAdd={handleAdd} />
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-gray-500">Nenhum resultado encontrado.</p>
      )}
    </div>
  );
}
