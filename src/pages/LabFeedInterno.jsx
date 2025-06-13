import { useOutletContext } from 'react-router-dom';
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

export default function LabFeed() {
  const { isMember } = useOutletContext();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {isMember && <PostSubmit />}
      {postsMock.map((p) => (
        <PostCard key={p.id} item={p} />
      ))}
    </div>
  );
}
