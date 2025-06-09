// import { useAuth } from '../contexts/AuthContext';
import LabCard from "../components/Labs/LabsCard";
import GlobalFeed from "./GlobalFeed";

const labsMock = [
  {
    id: 1,
    nome: "TeleMídia",
    descricaoCurta: "Pesquisa em processamento de sinais e imagens.",
    fotoUrl: "https://source.unsplash.com/random/400x300?tech",
    professorResponsavel: "Prof. Dr. Silva",
    accentColor: "cyan",
  },
  {
    id: 2,
    nome: "LabSoft",
    descricaoCurta: "Engenharia de software e metodologias ágeis.",
    fotoUrl: "https://source.unsplash.com/random/400x300?code",
    professorResponsavel: "Profa. Dra. Oliveira",
    accentColor: "green",
  },
  {
    id: 3,
    nome: "DataLab",
    descricaoCurta: "Ciência de dados aplicada a problemas reais.",
    fotoUrl: "https://source.unsplash.com/random/400x300?data",
    professorResponsavel: "Prof. Dr. Costa",
    accentColor: "amber",
  },
];

function LabsHome() {
  return (
    <div className="mx-auto max-w-6xl p-8">
      <h1 className="mb-6 text-2xl font-semibold">Laboratórios</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {labsMock.map((lab) => (
          <LabCard key={lab.id} {...lab} />
        ))}
      </div>
      <GlobalFeed />
    </div>
  );
}

export default LabsHome;
