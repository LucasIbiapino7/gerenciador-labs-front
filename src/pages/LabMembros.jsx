import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import MembrosFiltros from '../components/Membro/MembrosFiltros';
import MembrosContainer from '../components/Membro/MembrosContainer';

const membersMock = [
  {
    id: 1,
    nome: 'Prof. Carlos Salles',
    bio: 'Uma bio bem maior para ver como os cards vão ficar',
    role: 'professor',
    ativo: true,
    github_url: '',
    linkedin_url: 'https://linkedin.com',
    link_lattes: 'http://lattes',
  },
  {
    id: 2,
    nome: 'Ana Beatriz',
    bio: 'Mestranda em Eng. de Software',
    role: 'aluno',
    ativo: true,
    github_url: 'https://github.com',
    linkedin_url: '',
    link_lattes: '',
  },
  {
    id: 3,
    nome: 'João Pedro',
    bio: '',
    role: 'aluno',
    ativo: false,
    github_url: '',
    linkedin_url: '',
    link_lattes: '',
  },
];

export default function LabMembros() {
  const { labId, isAdmin } = useOutletContext();
  const [members, setMembers] = useState([]);
  const [filters, setFilters] = useState({ q: '', role: 'all' });

  useEffect(() => {
    setMembers(membersMock);
  }, [labId]);

  const ordered = members.sort((a, b) => {
    const rank = (m) => {
      if (!m.ativo) return 2;
      return m.role === 'professor' ? 0 : 1;
    };
    return rank(a) - rank(b);
  });

  const visibles = ordered
    .filter((m) => filters.role === 'all' || m.role === filters.role)
    .filter((m) => m.nome.toLowerCase().includes(filters.q.toLowerCase()));

  return (
    <div className="space-y-6">
      <MembrosFiltros filters={filters} setFilters={setFilters} />
      <MembrosContainer items={visibles} isAdmin={isAdmin}/>
    </div>
  );
}
