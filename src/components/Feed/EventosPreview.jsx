import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { NavLink, useOutletContext } from "react-router-dom";

function ensureDate(v) { return v instanceof Date ? v : new Date(v); }

export default function EventosPreview({ eventos }) {
  const { labId } = useOutletContext();

  if (!eventos?.length) return null;

  return (
    <aside className="lg:col-span-1 lg:max-w-xs space-y-4 rounded-xl border-2
                      border-primary/60 bg-white p-4 shadow">
      <h3 className="text-lg font-semibold text-primary">Próximos eventos</h3>

      {eventos.map((ev) => (
        <div key={ev.id} className="text-sm text-gray-800">
          <span className="font-medium">
            {format(ensureDate(ev.dataEvento), 'dd/MM', { locale: ptBR })}
          </span>{' '}
          {ev.titulo}
        </div>
      ))}

      <NavLink
        to={`/labs/${labId}/eventos`}
        className="inline-block pt-2 text-xs font-medium text-primary hover:underline"
      >
        Ver todos →
      </NavLink>
    </aside>
  );
}