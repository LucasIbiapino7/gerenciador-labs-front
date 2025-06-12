import { NavLink, Outlet, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

async function fetchLabAdminInfo(id) {
  const labs = {
    1: {
      nome: "TeleMídia",
      banner: "from-fuchsia-600 to-violet-500",
      logo: "/logos/telemedia.png",
    },
    2: {
      nome: "LabSoft",
      banner: "from-emerald-600 to-emerald-400",
      logo: "/logos/labsoft.png",
    },
    3: {
      nome: "DataLab",
      banner: "from-amber-500 to-orange-400",
      logo: "/logos/datalab.png",
    },
  };
  return (
    labs[id] || {
      nome: `Lab #${id}`,
      banner: "from-gray-600 to-gray-400",
      logo: "",
    }
  );
}

export default function LabAdminLayout() {
  const { id } = useParams();
  const labId = Number(id);
  const [lab, setLab] = useState(null);

  useEffect(() => {
    fetchLabAdminInfo(labId).then(setLab);
  }, [labId]);

  if (!lab) return <p className="p-8">Carregando…</p>;

  return (
    <div className="flex flex-col">
      <nav className="sticky top-16 z-10 bg-white shadow-sm">
        <div className="sticky top-[68px] z-20 bg-white shadow-sm">
          <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2">
            <Link
              to={`/labs/${labId}/feed`}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o lab
            </Link>
          </div>
        </div>
        <ul className="mx-auto flex max-w-6xl gap-6 px-4 py-3 text-sm font-medium text-gray-600">
          <li>
            <NavLink
              end
              to="."
              className={({ isActive }) =>
                isActive
                  ? "border-b-2 border-primary pb-1 text-primary"
                  : "pb-1"
              }
            >
              Informações
            </NavLink>
          </li>
          {["eventos", "materiais", "membros"].map((k) => (
            <li key={k}>
              <NavLink
                to={k}
                className={({ isActive }) =>
                  isActive
                    ? "border-b-2 border-primary pb-1 text-primary"
                    : "pb-1"
                }
              >
                {k.charAt(0).toUpperCase() + k.slice(1)}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div
        className={`relative flex h-40 items-end justify-between bg-gradient-to-r ${lab.banner} px-8 pb-6 text-white`}
      >
        <h1 className="text-3xl font-semibold drop-shadow-sm">{lab.nome} - Painel Administrativo</h1>
        {lab.logo && (
          <img
            src={lab.logo}
            alt={lab.nome}
            className="h-16 w-16 rounded-full border-4 border-white bg-white object-contain shadow-md"
          />
        )}
      </div>
      <main className="mx-auto w-full max-w-6xl p-8">
        <Outlet context={{ labId }} />
      </main>
    </div>
  );
}
