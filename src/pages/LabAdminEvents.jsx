import { useState } from 'react';
import { Plus } from 'lucide-react';
import EventCard from '../components/Feed/EventCard';
import EventModal from '../components/Events/EventModal';

const mock = [
  {
    id: 1,
    titulo: 'Workshop Testes',
    data: '2025-07-25',
    hora: '09:00',
    local: 'Sala 305',
    conteudo: '',
    lab: { nome: 'LabSoft' },
    author: { nome: 'Profa. Oliveira' },
  },
  {
    id: 2,
    titulo: 'Sprint Review',
    data: '2025-07-30',
    hora: '14:00',
    local: 'Sala 101',
    conteudo: '',
    lab: { nome: 'LabSoft' },
    author: { nome: 'Profa. Oliveira' },
  },
  {
    id: 3,
    titulo: 'Defesa TCC João',
    data: '2025-06-20',
    hora: '10:00',
    local: 'Auditório B',
    conteudo: '',
    lab: { nome: 'LabSoft' },
    author: { nome: 'Prof. Carlos' },
  },
];

export default function AdminEventosTab() {
  const [eventos, setEventos] = useState(mock);
  const [open, setOpen] = useState(false);

  const handleSave = (form) => {
    const dataHora = `${form.data ?? ''}T${form.hora ?? ''}`;

    if (form.id) {
      setEventos((prev) =>
        prev.map((e) => (e.id === form.id ? { ...e, ...form, dataHora } : e)),
      );
    } else {
      setEventos((prev) => [
        ...prev,
        { ...form, id: Date.now(), dataHora },
      ]);
    }
    setOpen(false);
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between">
        <h2 className="text-lg font-semibold">Eventos</h2>
        <button
          className="flex items-center gap-1 rounded bg-primary px-3 py-1.5 text-sm font-medium text-white"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-4 w-4" /> Novo evento
        </button>
      </header>

      <section className="space-y-4">
        {eventos.map((ev) => (
          <EventCard
            key={ev.id}
            item={{ ...ev, type: 'EVENT', dataHora: `${ev.data}T${ev.hora}` }}
            isAdmin
            onEdit={() => setOpen(true)}
          />
        ))}
      </section>

      <EventModal open={open} onClose={() => setOpen(false)} onSave={handleSave} />
    </div>
  );
}
