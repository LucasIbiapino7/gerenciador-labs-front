import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

import EventCard from '../components/Feed/EventCard';
import EventModal from '../components/Events/EventModal';

import {
  listarEventosLab,
  criarEvento,
  atualizarEvento,
} from '../services/EventsService';

function ensureDate(v) {
  return v instanceof Date ? v : new Date(v);
}

function splitDateParts(iso) {
  // Retorna partes seguras mesmo se o ISO estiver ausente ou inválido
  if (!iso || typeof iso !== 'string' || !iso.includes('T')) {
    return { data: '', hora: '' };
  }
  const base = iso.replace('Z', '');
  const [datePart, timePart = ''] = base.split('T');
  const hora = timePart.slice(0, 5); // HH:mm
  return { data: datePart, hora };
}

export default function LabAdminEvents() {
  const { labId } = useOutletContext();

  const [eventos, setEventos] = useState([]);
  const [loading, setLoad] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formError, setFormError] = useState(null);

  // Carrega eventos
  useEffect(() => {
    setLoad(true);
    setError(null);
    listarEventosLab(labId, { size: 100 })
      .then((r) => setEventos(r.content))
      .catch((err) => {
        console.error(err);
        setError('Não foi possível carregar os eventos.');
      })
      .finally(() => setLoad(false));
  }, [labId]);

  if (loading) return <p>Carregando eventos…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  // Ordena (mais recentes primeiro)
  const eventosOrdenados = [...eventos].sort((a, b) => {
    const da = ensureDate(a.instante ?? a.dataEvento).getTime();
    const db = ensureDate(b.instante ?? b.dataEvento).getTime();
    return db - da;
  });

  function openNew() {
    setEditing(null);
    setFormError(null);
    setModal(true);
  }

  function handleEdit(ev) {
    setEditing(ev);
    setFormError(null);
    setModal(true);
  }

  async function handleSave(payloadFromModal) {
    try {
      setFormError(null);

      if (editing) {
        // Atualiza evento existente
        const updated = await atualizarEvento(labId, editing.id, payloadFromModal);
        setEventos((prev) =>
          prev.map((e) => (e.id === updated.id ? updated : e))
        );
      } else {
        // Cria novo
        const created = await criarEvento(labId, payloadFromModal);
        setEventos((prev) => [created, ...prev]);
      }

      setModal(false);
      setEditing(null);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.errors?.[0]?.message;
      setFormError(msg || 'Falha ao salvar evento.');
    }
  }

  // Monta dados iniciais seguros para o modal
  let initialForModal = null;
  if (editing) {
    const raw = editing.dataEvento || editing.instante || '';
    const { data, hora } = splitDateParts(raw);
    initialForModal = {
      id: editing.id,
      titulo: editing.titulo || '',
      descricao: editing.descricao || editing.resumo || '',
      data,
      hora,
      local: editing.local || '',
    };
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Eventos</h2>
        <button
          onClick={openNew}
          className="flex items-center gap-1 rounded bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Novo evento
        </button>
      </header>

      <section className="space-y-4">
        {eventosOrdenados.length === 0 && (
            <p className="text-sm text-gray-500">Nenhum evento cadastrado.</p>
        )}
        {eventosOrdenados.map((ev) => (
          <EventCard
            key={ev.id}
            item={ev}
            isAdmin
            onEdit={() => handleEdit(ev)}
          />
        ))}
      </section>

      <EventModal
        open={modalOpen}
        onClose={() => {
          setModal(false);
          setEditing(null);
          setFormError(null);
        }}
        onSave={handleSave}
        initial={initialForModal}
        error={formError}
      />
    </div>
  );
}
