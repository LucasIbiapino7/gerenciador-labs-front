import { NavLink, useNavigate, Outlet, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getLabSummary } from '../../services/LabService';
import { useAuth } from '../../contexts/AuthContext';

function resolveLogo(raw) {
  if (!raw) return '';
  if (raw.includes('://')) return raw;
  const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
  return `${base}/api/files/download/${raw}`;
}

export default function LabLayout() {
  const { id } = useParams();
  const labId = Number(id);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [info, setInfo]   = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancel = false;
    getLabSummary(labId, isAuthenticated)
      .then(data => {
        if (cancel) return;
        const normalizedLogo = resolveLogo(data.logoUrl || data.logo_url);
        setInfo({ ...data, logoUrl: normalizedLogo });
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          navigate('/404', { replace: true });
        } else {
          console.error(err);
          setError('Não foi possível carregar o laboratório.');
        }
      });
    return () => { cancel = true; };
  }, [labId, isAuthenticated, navigate]);

  if (error) return <p className="p-8 text-red-600">{error}</p>;
  if (!info)  return <p className="p-8">Carregando laboratório…</p>;

  const {
    nome,
    logoUrl,
    owner,
    member,
    admin,
    bannerGradientClass,
  } = info;

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
                  ? 'border-b-2 border-primary pb-1 text-primary'
                  : 'pb-1'
              }
            >
              Feed
            </NavLink>
          </li>

          {member && (
            <li>
              <NavLink
                to="atividades"
                className={({ isActive }) =>
                  isActive
                    ? 'border-b-2 border-primary pb-1 text-primary'
                    : 'pb-1'
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
                  ? 'border-b-2 border-primary pb-1 text-primary'
                  : 'pb-1'
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
                  ? 'border-b-2 border-primary pb-1 text-primary'
                  : 'pb-1'
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
                    ? 'border-b-2 border-primary pb-1 text-primary'
                    : 'pb-1'
                }
              >
                Pesquisas
              </NavLink>
            </li>

          {admin && (
            <li>
              <NavLink
                to={`/labs/${labId}/admin`}
                className={({ isActive }) =>
                  isActive
                    ? 'border-b-2 border-primary pb-1 text-primary'
                    : 'pb-1'
                }
              >
                Administração
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
      <div
        className={`relative flex h-40 items-end justify-between bg-gradient-to-r ${bannerGradientClass} px-8 pb-6 text-white`}
      >
        <h1 className="text-3xl font-semibold drop-shadow-sm">{nome}</h1>
        {logoUrl && (
          <img
            src={logoUrl}
            alt={nome}
            className="h-16 w-16 rounded-full border-4 border-white bg-white object-cover shadow-md"
            draggable={false}
          />
        )}
      </div>

      <div className="mx-auto w-full max-w-6xl p-8">
        <Outlet context={{ labId, member, admin, owner }} />
      </div>
    </div>
  );
}
