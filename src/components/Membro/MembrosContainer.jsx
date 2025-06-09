import MembroCard from './MembroCard';

export default function MembrosContainer({ items }) {
  if (!items?.length) return <p className="text-center text-sm text-gray-500">Nenhum membro encontrado.</p>;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
      {items.map((m) => (
        <MembroCard key={m.id} member={m} />
      ))}
    </div>
  );
}
