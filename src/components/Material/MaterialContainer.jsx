import MaterialCard from './MaterialCard';

export default function MaterialContainer({ items, isAdmin, onEdit }) {
  if (!items?.length) return <p className="text-center text-sm text-gray-500">Nenhum material encontrado.</p>;
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((m) => (
        <MaterialCard key={m.id} item={m} isAdmin={isAdmin} onEdit={onEdit} />
      ))}
    </div>
  );
}
