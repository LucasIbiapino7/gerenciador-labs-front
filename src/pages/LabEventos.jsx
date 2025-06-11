import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useOutletContext, useNavigate } from "react-router-dom";
import EventCard from "../components/Feed/EventCard";
import { isAfter, parseISO } from "date-fns";

const eventosMock = [
  {
    id: 201,
    titulo: "Reunião Sprint 12",
    dataHora: "2025-07-10T10:00:00Z",
    local: "Sala 305",
    lab: { nome: "LabSoft" },
    author: { nome: "Profa. Oliveira" },
  },
  {
    id: 202,
    titulo: "Palestra Clean Code",
    dataHora: "2025-04-20T15:30:00Z",
    local: "Auditório A",
    lab: { nome: "LabSoft" },
    author: { nome: "Profa. Oliveira" },
  },
  {
    id: 203,
    titulo: "Defesa de Mestrado João",
    dataHora: "2025-06-20T14:00:00Z",
    local: "Auditório B",
    lab: { nome: "LabSoft" },
    author: { nome: "Prof. Carlos" },
  },
];

export default function LabEventos() {
  const { labId, isAdmin } = useOutletContext();
  const [eventos, setEventos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Aqui vai ser a chamadaa ao backend
    setEventos(eventosMock);
  }, [labId]);

  function handleEdit() {
    console.log("clicou");
  }

  const hoje = new Date();
  const futuros = eventos.filter((e) => isAfter(parseISO(e.dataHora), hoje));
  const passados = eventos.filter((e) => !isAfter(parseISO(e.dataHora), hoje));

  return (
    <div className="space-y-8">
      {isAdmin && (
        <button
          onClick={() => navigate(`/labs/${labId}/eventos/novo`)}
          className="flex items-center gap-1 rounded bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Adicionar evento
        </button>
      )}
      {futuros.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">
            Próximos eventos
          </h2>
          {futuros.map((event) => (
            <EventCard
              key={event.id}
              item={{ ...event, type: "EVENT" }}
              isAdmin={isAdmin}
              onEdit={handleEdit}
            />
          ))}
        </section>
      )}

      {passados.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Eventos passados
          </h2>
          {passados.map((event) => (
            <EventCard key={event.id} item={{ ...event, type: "EVENT" }} />
          ))}
        </section>
      )}
    </div>
  );
}
