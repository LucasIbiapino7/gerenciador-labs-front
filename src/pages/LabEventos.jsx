import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { isAfter } from 'date-fns';

import EventCard  from '../components/Feed/EventCard';
import EventModal from '../components/Events/EventModal';

import {
  listarEventosLab,
  criarEvento,
  atualizarEvento,
} from '../services/EventsService';

function ensureDate(v) {
  return v instanceof Date ? v : new Date(v);
}

export default function LabEventos() {
  const { labId, admin } = useOutletContext();

  const [eventos, setEventos] = useState([]);
  const [loading, setLoad]    = useState(true);
  const [error,   setError]   = useState(null);

  const [modalOpen, setModal] = useState(false);
  const [editing,   setEdit]  = useState(null);  
  const [formError, setFErr]  = useState(null);

  useEffect(() => {
    setLoad(true);
    listarEventosLab(labId, { size: 50 })
      .then((r) => setEventos(r.content))
      .catch(() => setError('Não foi possível carregar os eventos.'))
      .finally(() => setLoad(false));
  }, [labId]);

  if (loading) return <p>Carregando eventos…</p>;
  if (error)   return <p className="text-red-600">{error}</p>;

  const now = new Date();
  const futuros  = eventos.filter((e) =>
    isAfter(ensureDate(e.instante ?? e.dataEvento), now)
  );
  const passados = eventos.filter((e) =>
    !isAfter(ensureDate(e.instante ?? e.dataEvento), now)
  );
  const handleSave = async (payload) => {
    try {
      let salvo;
      if (payload.id) {
        salvo = await atualizarEvento(labId, payload.id, payload);
        setEventos((prev) =>
          prev.map((ev) => (ev.id === salvo.id ? salvo : ev))
        );
      } else {
        salvo = await criarEvento(labId, payload);
        setEventos((prev) => [salvo, ...prev]);
      }
      setModal(false);
      setEdit(null);
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.message;
      setFErr(msg || 'Falha ao salvar evento.');
    }
  };

  const openNew = () => {
    setEdit(null);
    setFErr(null);
    setModal(true);
  };

  const handleEdit = (item) => {
    setEdit(item);
    setFErr(null);
    setModal(true);
  };

  return (
    <div className="space-y-8">
      {admin && (
        <button
          onClick={openNew}
          className="flex items-center gap-1 rounded bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Adicionar evento
        </button>
      )}

      {futuros.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">Próximos eventos</h2>
          {futuros.map((e) => (
            <EventCard
              key={e.id}
              item={e}
              isAdmin={admin}
              onEdit={handleEdit}
            />
          ))}
        </section>
      )}

      {passados.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Eventos passados</h2>
          {passados.map((e) => (
            <EventCard key={e.id} item={e} />
          ))}
        </section>
      )}

      {futuros.length === 0 && passados.length === 0 && (
        <p className="text-gray-500">Nenhum evento encontrado.</p>
      )}

      <EventModal
        open={modalOpen}
        onClose={() => { setModal(false); setEdit(null); }}
        onSave={handleSave}
        initial={editing}
        error={formError}
      />
    </div>
  );
}
