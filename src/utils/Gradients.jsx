const gradients = [
  { id: 'emerald', label: 'Verde',  value: 'from-emerald-600 to-emerald-400' },
  { id: 'fuchsia', label: 'Roxo',   value: 'from-fuchsia-600 to-violet-500' },
  { id: 'amber',   label: 'Laranja',value: 'from-amber-500 to-orange-400'  },
  { id: 'gray',    label: 'Cinza',  value: 'from-gray-600 to-gray-400'     },
];

export default function Gradients({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {gradients.map((g) => (
        <button
          key={g.id}
          type="button"
          onClick={() => onChange(g.value)}
          className={`h-10 rounded-lg bg-gradient-to-r ${g.value} ring-2 ring-transparent transition hover:ring-primary/60 ${value === g.value ? 'ring-4 ring-primary' : ''}`}
          title={g.label}
        />
      ))}
    </div>
  );
}
