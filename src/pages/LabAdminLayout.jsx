import { NavLink, Outlet, useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { obterLabAdmin } from '../services/LabService';
import { LAB_GRADIENTS, FALLBACK_GRADIENT } from '../constants/gradients';

function resolveLogo(raw) {
  if (!raw) return '';
  if (raw.includes('://')) return raw;
  const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
  return `${base}/api/files/download/${raw}`;
}

export default function LabAdminLayout() {
  const { id } = useParams();
  const labId = Number(id);
  const navigate = useNavigate();

  const [lab, setLab] = useState(null);
  const [loading, setLoad] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancel = false;
    setLoad(true);
    setError(null);

    obterLabAdmin(labId)
      .then(data => {
        if (cancel) return;
        const normalizedLogo = resolveLogo(data.logoUrl || data.logo_url);
        setLab({ ...data, logoUrl: normalizedLogo });
      })
      .catch((err) => {
        if (cancel) return;
        const status = err.response?.status;
        if (status === 404) {
          navigate('/404', { replace: true });
          return;
        }
        if (status === 403) {
          setError('Você não tem permissão para acessar o painel administrativo deste laboratório.');
          return;
        }
        if (status === 401) {
          setError('Sessão expirada ou não autenticado. Faça login novamente.');
          return;
        }
        setError('Falha ao carregar informações do laboratório.');
      })
      .finally(() => !cancel && setLoad(false));

    return () => { cancel = true; };
  }, [labId, navigate]);

  if (loading) return <p className="p-8">Carregando…</p>;

  if (error) {
    return (
      <div className="p-8 space-y-4">
        <p className="text-red-600">{error}</p>
        <Link
          to={`/labs/${labId}/feed`}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para o lab
        </Link>
      </div>
    );
  }

  const gradientClass =
    LAB_GRADIENTS[lab.gradientAccent] ||
    lab.bannerGradient ||
    FALLBACK_GRADIENT;

  return (
    <div className="flex flex-col">
      <nav className="sticky top-16 z-10 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2">
          <Link
            to={`/labs/${labId}/feed`}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o lab
          </Link>
        </div>
        <ul className="mx-auto flex max-w-6xl gap-6 px-4 pb-3 text-sm font-medium text-gray-600">
          <li>
            <NavLink
              end
              to="."
              className={({ isActive }) =>
                isActive
                  ? 'border-b-2 border-primary pb-1 text-primary'
                  : 'pb-1'
              }
            >
              Informações
            </NavLink>
          </li>
          {['eventos', 'materiais', 'membros'].map((k) => (
            <li key={k}>
              <NavLink
                to={k}
                className={({ isActive }) =>
                  isActive
                    ? 'border-b-2 border-primary pb-1 text-primary'
                    : 'pb-1'
                }
              >
                {k.charAt(0).toUpperCase() + k.slice(1)}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div
        className={`relative flex h-40 items-end justify-between bg-gradient-to-r ${gradientClass} px-8 pb-6 text-white`}
      >
        <h1 className="text-2xl md:text-3xl font-semibold drop-shadow-sm">
          {lab.nome} — Painel Administrativo
        </h1>
        {lab.logoUrl && (
          <img
            src={lab.logoUrl}
            alt={lab.nome}
            className="h-16 w-16 rounded-full border-4 border-white bg-white object-cover shadow-md"
            draggable={false}
          />
        )}
      </div>

      <main className="mx-auto w-full max-w-6xl p-8">
        <Outlet context={{ labId, lab, setLab }} />
      </main>
    </div>
  );
}
