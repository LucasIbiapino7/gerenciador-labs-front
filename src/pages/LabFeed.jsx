import { useOutletContext } from 'react-router-dom';
import EventosPreview from '../components/Feed/EventosPreview';
import PostCard from '../components/Feed/PostCard';
import PostSubmit from '../components/Feed/PostSubmit';

const postsMock = [
  {
    id: 101,
    type: 'POST',
    lab: { id: 2, nome: 'LabSoft' },
    author: { id: 1, nome: 'Ana Beatriz' },
    titulo: '',
    conteudo: 'Saiu o resultado dos testes de integração 🎉',
    dataHora: '2025-07-04T18:20:00Z',
  },
  {
    id: 102,
    type: 'POST',
    lab: { id: 2, nome: 'LabSoft' },
    author: { id: 2, nome: 'Rafael Costa' },
    titulo: 'Release 2.0 disponível',
    conteudo: 'Confiram a branch release/2.0 para detalhes.',
    dataHora: '2025-07-03T14:10:00Z',
  },
];

const eventosMock = [
  {
    id: 201,
    titulo: 'Reunião Sprint 12',
    dataHora: '2025-07-10T10:00:00Z',
    local: 'Sala 305',
  },
  {
    id: 202,
    titulo: 'Palestra Clean Code',
    dataHora: '2025-07-20T15:30:00Z',
    local: 'Auditório A',
  },
  {
    id: 203,
    titulo: 'Workshop Git',
    dataHora: '2025-08-01T09:00:00Z',
    local: 'Lab 101',
  },
];

export default function LabFeed() {
  const { isMember } = useOutletContext();

  return (
    <div className="grid gap-6 lg:grid-cols-3 items-start">
      <EventosPreview eventos={eventosMock.slice(0, 3)} />

      <section className="space-y-6 lg:col-span-2">
        {isMember && <PostSubmit />}
        {postsMock.map((p) => (
          <PostCard key={p.id} item={p} />
        ))}
      </section>
    </div>
  );
}

