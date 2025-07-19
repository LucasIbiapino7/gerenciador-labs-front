import { useEffect, useState } from "react";
import LabCard from "../components/Labs/LabsCard";
import GlobalFeed from "./GlobalFeed";
import { listarLabs } from "../services/LabService";

function LabsHome() {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    listarLabs({ size: 9 })
      .then(res => setLabs(res.content))
      .catch(err => {
        console.error(err);
        setError("Não foi possível carregar os laboratórios.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl p-8">
        <p className="text-sm text-gray-600">Carregando laboratórios…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl p-8">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-8">
      <h1 className="mb-6 text-2xl font-semibold">Laboratórios</h1>

      {labs.length === 0 ? (
        <p className="text-sm text-gray-600">
          Nenhum laboratório encontrado.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {labs.map(lab => (
            <LabCard
              key={lab.id}
              id={lab.id}
              nome={lab.nome}
              descricaoCurta={lab.descricaoCurta}
              fotoUrl={lab.logoUrl}                   
              professorResponsavel={lab.professorResponsavel?.nome}
              accentColor={lab.accentColor}
            />
          ))}
        </div>
      )}

      <div className="mt-10">
        <GlobalFeed />
      </div>
    </div>
  );
}

export default LabsHome;
