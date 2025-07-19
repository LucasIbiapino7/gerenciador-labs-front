import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const accentToGradient = {
  cyan: "from-cyan-500 to-blue-500",
  green: "from-emerald-500 to-emerald-700",
  amber: "from-amber-400 to-amber-600",
  rose: "from-rose-500 to-pink-600",
};

const fallbackGradient = "from-primary to-primary/80";

export default function LabCard({
  id,
  nome,
  descricaoCurta,
  fotoUrl,
  professorResponsavel,
  accentColor = "cyan",
}) {
  const navigate = useNavigate();
  const gradient = accentToGradient[accentColor] ?? fallbackGradient;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/labs/${id}/feed`)}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/labs/${id}/feed`)}
      className="group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow transition-shadow hover:shadow-lg"
    >
      <div className={`relative h-28 w-full bg-gradient-to-r ${gradient}`}>
        <h3 className="absolute left-4 top-4 max-w-[70%] truncate text-lg font-semibold text-white drop-shadow-sm">
          {nome}
        </h3>

        {fotoUrl ? (
          <img
            src={fotoUrl}
            alt={nome}
            className="absolute -bottom-6 right-4 h-16 w-16 rounded-full border-4 border-white object-cover shadow-md"
            draggable={false}
          />
        ) : (
          <div className="absolute -bottom-6 right-4 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white/20 text-lg font-bold text-white shadow-md backdrop-blur">
            {nome?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 px-4 pb-4 pt-8">
        {professorResponsavel && (
          <span className="mb-1 inline-block rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {professorResponsavel}
          </span>
        )}

        <p className="line-clamp-2 text-sm text-gray-700">
          {descricaoCurta || "Sem descrição."}
        </p>
      </div>
    </div>
  );
}

LabCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  nome: PropTypes.string.isRequired,
  descricaoCurta: PropTypes.string.isRequired,
  fotoUrl: PropTypes.string,
  professorResponsavel: PropTypes.string,
  accentColor: PropTypes.string,
};

LabCard.defaultProps = {
  fotoUrl: "",
  professorResponsavel: "",
  accentColor: "cyan",
};
