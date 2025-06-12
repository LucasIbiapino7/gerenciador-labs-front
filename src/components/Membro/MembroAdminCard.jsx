import { Plus } from 'lucide-react';

const bgMap = {
  professor: 'bg-amber-500',
  aluno: 'bg-cyan-500',
};

function FallbackAvatar({ name, role }) {
  const initial = name.charAt(0).toUpperCase();
  const bg = bgMap[role] || 'bg-gray-500';
  return (
    <span className={`${bg} flex h-full w-full items-center justify-center rounded-full text-lg font-semibold text-white`}>
      {initial}
    </span>
  );
}

export default function MembroAdminCard({ user, onAdd }) {
  const { nome, role, photoUrl } = user;
  return (
    <div className="relative rounded-xl bg-white p-4 text-center ring-1 ring-gray-200 shadow-sm transition hover:shadow-md">
      <div className="relative mx-auto h-20 w-20">
        {photoUrl ? (
          <img src={photoUrl} alt={nome} className="h-full w-full rounded-full object-cover ring-4 ring-white shadow" />
        ) : (
          <FallbackAvatar name={nome} role={role} />
        )}
      </div>
      <h4 className="mt-3 text-base font-semibold text-gray-900">{nome}</h4>
      <span className={`mt-1 inline-block rounded px-2 py-0.5 text-xs font-medium ${role === 'professor' ? 'bg-amber-100 text-amber-700' : 'bg-cyan-100 text-cyan-700'}`}> {role === 'professor' ? 'Professor' : 'Aluno'} </span>
      <button
        onClick={() => onAdd(user)}
        className="mt-4 flex items-center justify-center gap-1 rounded bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary/90 w-full"
      >
        <Plus className="h-4 w-4" /> Adicionar
      </button>
    </div>
  );
}
