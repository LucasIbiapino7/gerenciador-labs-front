import { NavLink, Outlet, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

async function fetchLabInfo(labId) {
  const labs = {
    1: {
      nome: "TeleMídia",
      bannerGradient: "from-fuchsia-600 to-violet-500",
      logoUrl: "/logos/telemedia.png",
    },
    2: {
      nome: "LabSoft",
      bannerGradient: "from-emerald-600 to-emerald-400",
      logoUrl: "/logos/labsoft.png",
    },
    3: {
      nome: "DataLab",
      bannerGradient: "from-amber-500 to-orange-400",
      logoUrl: "/logos/datalab.png",
    },
  };

  return {
    lab: labs[labId] || {
      nome: `Lab #${labId}`,
      bannerGradient: "from-gray-600 to-gray-400",
      logoUrl: "",
    },
    isMember: labId % 2 === 0,
    isAdmin:  true
  };
}

export default function LabLayout() {
  const { id } = useParams(); 
  const labId = Number(id); 

  const [info, setInfo] = useState(null);

  useEffect(() => {
    fetchLabInfo(labId).then(setInfo);
  }, [labId]);

  if (!info) return <p className="p-8">Carregando laboratório…</p>;

  const { lab, isMember, isAdmin } = info;

  return (
    <div className="flex flex-col">
      <nav className="sticky top-16 z-10 bg-white shadow-sm">
        <ul className="mx-auto flex max-w-6xl gap-6 px-4 py-3 text-sm font-medium text-gray-600">
          <li>
            <NavLink
              to="feed"
              end
              className={({ isActive }) =>
                isActive
                  ? "border-b-2 border-primary pb-1 text-primary"
                  : "pb-1"
              }
            >
              Feed
            </NavLink>
          </li>

          {isMember && (
            <li>
              <NavLink
                to="atividades"
                className={({ isActive }) =>
                  isActive
                    ? "border-b-2 border-primary pb-1 text-primary"
                    : "pb-1"
                }
              >
                Feed Interno
              </NavLink>
            </li>
          )}

          <li>
            <NavLink
              to="materiais"
              className={({ isActive }) =>
                isActive
                  ? "border-b-2 border-primary pb-1 text-primary"
                  : "pb-1"
              }
            >
              Materiais
            </NavLink>
          </li>

          <li>
            <NavLink
              to="membros"
              className={({ isActive }) =>
                isActive
                  ? "border-b-2 border-primary pb-1 text-primary"
                  : "pb-1"
              }
            >
              Membros
            </NavLink>
          </li>

          <li>
            <NavLink
              to="pesquisas"
              className={({ isActive }) =>
                isActive
                  ? "border-b-2 border-primary pb-1 text-primary"
                  : "pb-1"
              }
            >
              Pesquisas
            </NavLink>
          </li>
        </ul>
      </nav>
      <div
        className={`relative flex h-40 items-end justify-between bg-gradient-to-r ${lab.bannerGradient} px-8 pb-6 text-white`}
      >
        <h1 className="text-3xl font-semibold drop-shadow-sm">{lab.nome}</h1>

        {lab.logoUrl && (
          <img
            src={lab.logoUrl}
            alt={lab.nome}
            className="h-16 w-16 rounded-full border-4 border-white bg-white object-contain shadow-md"
          />
        )}
      </div>
      <div className="mx-auto w-full max-w-6xl p-8">
        <Outlet context={{ labId, isMember, isAdmin  }} />
      </div>
    </div>
  );
}
